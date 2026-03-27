import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Search, ShieldCheck, Clock } from 'lucide-react';

const Home = () => {
  const { user } = useAuth();

  return (
    <div>
      <section className="text-center mt-8 mb-8" style={{ padding: '4rem 0' }}>
        <h1 style={{ fontSize: '3rem', fontWeight: 800, marginBottom: '1rem', color: 'var(--text-main)', letterSpacing: '-1px' }}>
          Find What You Lost,<br/> Return What You Found.
        </h1>
        <p className="text-muted" style={{ fontSize: '1.25rem', maxWidth: '600px', margin: '0 auto 2rem' }}>
          Welcome to the Student Lost and Found System. The easiest way to report lost items and claim what is rightfully yours on campus.
        </p>
        <div className="flex justify-center gap-4">
          <Link to="/items" className="btn btn-primary" style={{ fontSize: '1.125rem', padding: '1rem 2rem' }}>
            <Search size={20} /> Browse Lost Items
          </Link>
          {!user && (
            <Link to="/register" className="btn btn-outline" style={{ fontSize: '1.125rem', padding: '1rem 2rem' }}>
              Create an Account
            </Link>
          )}
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
