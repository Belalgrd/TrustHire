import connectDB from '@/lib/db';
import ChallengeFee from '@/models/ChallengeFee';
import Application from '@/models/Application';
import Job from '@/models/Job';
import razorpay from '@/lib/razorpay';

// ── Evaluate what to do with a held fee ──
export function evaluateRefund(application, job) {
  // RULE 1: Rejected → REFUND
  if (application.status === 'rejected') {
    return { action: 'refund', reason: 'Application rejected by recruiter' };
  }

  // RULE 2: Not reviewed within X days → REFUND
  const daysPassed = Math.floor(
    (Date.now() - new Date(application.createdAt)) / (1000 * 60 * 60 * 24)
  );
  if (application.status === 'pending' && daysPassed > job.reviewWindowDays) {
    return {
      action: 'refund',
      reason: `Not reviewed within ${job.reviewWindowDays} days`,
    };
  }

  // RULE 3: Interview no-show → FORFEIT
  if (application.status === 'interview_no_show') {
    return { action: 'forfeit', reason: 'Did not attend scheduled interview' };
  }

  // RULE 4: Hired → REFUND
  if (application.status === 'hired') {
    return { action: 'refund', reason: 'Successfully hired — congratulations!' };
  }

  // RULE 5: Interview attended → REFUND
  if (application.status === 'interview_attended') {
    return { action: 'refund', reason: 'Attended interview' };
  }

  // Default: keep holding
  return { action: 'hold', reason: 'Awaiting recruiter decision' };
}

// ── Process all held fees ──
export async function processRefunds() {
  await connectDB();

  const heldFees = await ChallengeFee.find({ status: 'held' })
    .populate({
      path: 'applicationId',
      populate: { path: 'jobId' },
    })
    .lean();

  console.log(`🔄 Processing ${heldFees.length} held fees...`);

  let refunded = 0;
  let forfeited = 0;
  let held = 0;
  let errors = 0;

  for (const fee of heldFees) {
    if (!fee.applicationId || !fee.applicationId.jobId) {
      console.warn(`⚠️ Skipping fee ${fee._id} — missing refs`);
      continue;
    }

    const decision = evaluateRefund(
      fee.applicationId,
      fee.applicationId.jobId
    );

    try {
      if (decision.action === 'refund') {
        // Process Razorpay refund
        const refund = await razorpay.payments.refund(
          fee.razorpayPaymentId,
          {
            amount: fee.amount * 100,
            notes: {
              reason: decision.reason,
              feeId: fee._id.toString(),
            },
          }
        );

        await ChallengeFee.findByIdAndUpdate(fee._id, {
          status: 'refunded',
          reason: decision.reason,
          razorpayRefundId: refund.id,
          processedAt: new Date(),
        });

        console.log(`✅ Refunded ₹${fee.amount} — ${decision.reason}`);
        refunded++;
      } else if (decision.action === 'forfeit') {
        await ChallengeFee.findByIdAndUpdate(fee._id, {
          status: 'forfeited',
          reason: decision.reason,
          processedAt: new Date(),
        });

        console.log(`🚫 Forfeited ₹${fee.amount} — ${decision.reason}`);
        forfeited++;
      } else {
        held++;
      }
    } catch (error) {
      console.error(`❌ Error processing fee ${fee._id}:`, error.message);
      errors++;
    }
  }

  return { refunded, forfeited, held, errors, total: heldFees.length };
}