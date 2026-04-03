'use client';
import { useState } from 'react';
import { ReviewModal } from '@/components/ReviewModal';
import { useLanguage } from '@/components/LanguageProvider';

export function LeaveReviewButton() {
  const { t } = useLanguage();
  const [showModal, setShowModal] = useState(false);

  return (
    <>
      {showModal && <ReviewModal onClose={() => setShowModal(false)} />}
      <button
        onClick={() => setShowModal(true)}
        className="btn-orange cursor-pointer"
      >
        {t('review.leave_review')} ✍️
      </button>
    </>
  );
}
