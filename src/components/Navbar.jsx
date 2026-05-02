import { Link, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { useCart } from '../context/CartContext';
import '../layouts/Navbar.css';

const Navbar = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const { cart } = useCart();

  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    navigate('/login');
  };

  const totalQuantity = cart.reduce((acc, item) => acc + parseInt(item.quantity || 0), 0);

  return (
    <nav className="navbar">
      <Link to="/" className="logo">
        <i className="fas fa-prescription-bottle-alt"></i> صيدليتي
      </Link>
      
      <div className="search-box">
        <i className="fas fa-search"></i>
        <input type="text" placeholder="ابحث عن دواء، مستلزمات طبية..." />
      </div>

      <div className="nav-icons">
        
        
        
        <Link title="المفضلة" to="/wishlist"><i className="far fa-heart"></i></Link>
        <Link to="/cart" className="relative">
          <i className="fas fa-shopping-basket"></i>
          {/* Cart count */}
          {totalQuantity > 0 && (
            <span className="cart-badge">{totalQuantity}</span>
          )}
        </Link>


        {user ? (
          <div className="user-nav-group" style={{display: 'flex', gap: '15px', alignItems: 'center'}}>
            <Link to="/profile" style={{fontSize: '0.9rem', fontWeight: 'bold'}}>أهلاً، {user.name}</Link>
            <button onClick={handleLogout} style={{background: 'none', border: 'none', cursor: 'pointer', color: '#ef4444'}}>
              <i className="fas fa-sign-out-alt"></i>
            </button>
          </div>
        ) : (
          <Link title="تسجيل الدخول" to="/login"><i className="far fa-user"></i></Link>
        )}
      </div>
    </nav>
  );
};

export default Navbar;