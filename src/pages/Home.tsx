import React from 'react';
import { useSpring, animated } from '@react-spring/web';
import mainImage from '../assets/main.png'; // Resmi import ediyoruz
import './Home.css'; // CSS dosyasını import ediyoruz
import { Link } from 'react-router-dom'; 


const Home: React.FC = () => {
  // useSpring ile animasyon efektini ayarlıyoruz
  const props = useSpring({
    from: { transform: 'translateY(20px)' }, // Başlangıç pozisyonu
    to: { transform: 'translateY(50px)' }, // Hedef pozisyon
    config: { duration: 1500 }, // Animasyonun süresi (ms cinsinden)
    loop: { reverse: true }, // Animasyonun hem ileri hem geri hareket etmesini sağlar
  });

  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      height: '90vh',
      width: '100%',
      padding: '0 20px',
      boxSizing: 'border-box',
    }}>
      <div style={{
        
        fontSize: '120px',
        fontWeight: 'bold',
        display: 'flex',
        flexDirection: 'column',
      
      }}>
        <div>Track Crypto</div>
        <div style={{
          color: 'yellow',
          fontSize: '90px',
          fontStyle: 'italic',
          textShadow: '2px 2px 4px rgba(0, 0, 0, 0.5)',
        }}>
          Real Time
        </div>
        <div style={{
          marginTop: '20px', // Butonlar arasındaki boşluk
          display: 'flex',
          gap: '10px', // Butonlar arasındaki boşluk
        }}>
          <Link to="/dashboard" className="link">
            <button className="button home-button">Dashboard</button>
          </Link>
          <Link to="/about" className="link">
            <button className="button about-button">About</button>
          </Link>
        </div>
      </div>
      
      <animated.img
        src={mainImage}
        style={{
          ...props,
          width: '280px',
          marginRight: '100px', // Sağdan mesafe ekleme
        }}
      />
    </div>

    
  );
};

export default Home;
