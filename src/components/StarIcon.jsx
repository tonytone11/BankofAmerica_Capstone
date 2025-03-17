import React from 'react';
import { Star } from 'lucide-react';

const StarIcon = () => {
    return (
        <div className="soccer-ball-icon" style={{
            width: '30px',
            height: '30px',
            backgroundColor: '#4ade80',
            borderRadius: '50%',
            position: 'relative',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center'
        }}>
        <Star 
            size={20} 
            color="#1e3a8a" 
            fill="#1e3a8a"
        />
        </div>
    );
};

export default StarIcon;