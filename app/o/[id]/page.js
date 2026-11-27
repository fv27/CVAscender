'use client';
// Full page for one opportunity — Circle / Care.com layout with a sticky
// facts card on desktop and a Meetup-style action bar on phones.
import Link from 'next/link';
import { useParams } from 'next/navigation';
import Nav from '@/components/Nav';
import Icon from '@/components/Icon';
import { DetailBody } from '@/components/DetailSheet';
import { useApp } from '@/components/AppProvider';
import { getOpportunity } from '@/lib/opportunities';

export default function OpportunityPage() {
  const { id } = useParams();
  const { ready } = useApp();
  const o = getOpportunity(String(id));

  return (
    <div className="min-h-dvh bg-paper pb-40 lg:pb-16">
      <Nav />
      <main className="lg:pt-16"><div className="mx-auto max-w-5xl px-4 pt-5 lg:px-10 lg:pt-10">
        <button onClick={() => history.length > 1 ? history.back() : (location.href = '/explore')}
          className="mb-5 inline-flex items-center gap-1.5 pr-12 text-sm font-semibold text-ink-muted hover:text-ink">
          <Icon name="back" size={16} /> Back
        </button>
        {!ready ? null : o ? <DetailBody o={o} layout="page" /> : (
          <div className="py-24 text-center">
            <div className="font-display text-4xl">Not found</div>
            <p className="mt-2 text-ink-soft">This listing may have been removed.</p>
            <Link href="/explore" className="btn-primary mt-6">Explore opportunities</Link>
          </div>
        )}
      </div></main>
    </div>
  );
}
