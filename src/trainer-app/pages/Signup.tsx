import { useState } from "react";
import { AnimatedPage } from "@/components/animated-page";
import { TrainerSignupForm } from "@/components/trainer-app/trainer-signup-form";
import { InterviewModal } from "@/components/trainer-app/interview-modal";
import type { TrainerProfile } from "@/types/trainer";

export default function TrainerSignupPage() {
  const [showInterviewModal, setShowInterviewModal] = useState(false);
  const [trainerProfile, setTrainerProfile] = useState<TrainerProfile | null>(
    null
  );

  const handleSignupSuccess = (profile: TrainerProfile) => {
    setTrainerProfile(profile);
    setShowInterviewModal(true);
  };

  return (
    <AnimatedPage>
      <div className="min-h-[calc(100vh-4rem)] flex flex-col items-center justify-center p-4 bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-950 dark:to-orange-900">
        <div className="w-full max-w-3xl space-y-8 mb-8">
          <TrainerSignupForm onSignupSuccess={handleSignupSuccess} />
        </div>

        {showInterviewModal && trainerProfile && (
          <InterviewModal
            isOpen={showInterviewModal}
            onClose={() => setShowInterviewModal(false)}
            trainerProfile={trainerProfile}
          />
        )}
      </div>
    </AnimatedPage>
  );
}
