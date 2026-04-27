import { Link } from 'react-router-dom';
import { LF } from '../constants/lostFoundRoutes';
import { Search, ShieldCheck, Clock } from 'lucide-react';

const Home = () => {
  return (
    <div>
      <section className="text-center mt-8 mb-8" style={{ padding: '4rem 0' }}>
        <h1 style={{ fontSize: 'clamp(1.75rem, 4vw, 2.75rem)', fontWeight: 800, marginBottom: '1rem', color: 'var(--text-dark, #111827)', letterSpacing: '-0.03em', lineHeight: 1.2 }}>
          Lost Item<br />In your campus
        </h1>
        <p className="text-muted" style={{ fontSize: '1.05rem', maxWidth: '560px', margin: '0 auto 2rem', color: 'var(--text-light, #64748b)', lineHeight: 1.6 }}>
          Items reported to student support appear here. Browse listings, then submit a claim with proof if you recognize something.
        </p>
        <div className="flex justify-center gap-4">
          <Link to={LF.browse} className="btn btn-primary" style={{ fontSize: '1.125rem', padding: '1rem 2rem' }}>
            <Search size={20} /> Browse Lost Items
          </Link>

        </div>
      </section>

      <section className="grid grid-cols-3 mt-8">
        <div className="card card-body text-center">
          <div style={{ background: '#e0e7ff', width: '64px', height: '64px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem', color: 'var(--primary)' }}>
            <Search size={32} />
          </div>
          <h3 className="card-title">Easy Search</h3>
          <p className="card-text">Filter and search through our database to easily find your missing items securely.</p>
        </div>
        <div className="card card-body text-center">
          <div style={{ background: '#d1fae5', width: '64px', height: '64px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem', color: 'var(--success)' }}>
            <ShieldCheck size={32} />
          </div>
          <h3 className="card-title">Secure Claims</h3>
          <p className="card-text">Submit proof of ownership and our admins will verify and approve your claims safely.</p>
        </div>
        <div className="card card-body text-center">
          <div style={{ background: '#fef3c7', width: '64px', height: '64px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem', color: 'var(--warning)' }}>
            <Clock size={32} />
          </div>
          <h3 className="card-title">Fast Recovery</h3>
          <p className="card-text">A streamlined process ensures you get your belongings back as quickly as possible.</p>
        </div>
      </section>
    </div>
  );
};

export default Home;
