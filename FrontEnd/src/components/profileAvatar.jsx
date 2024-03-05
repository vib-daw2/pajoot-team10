import React from 'react';

    const avatarsArray = [
        './assets/avatar/gato-1.png',
        './assets/avatar/gato-2.png',
        './assets/avatar/gato-3.png',
        './assets/avatar/gato-4.png',
        './assets/avatar/gato-5.png',
        './assets/avatar/gato-6.png',
        './assets/avatar/gato-7.png',
        './assets/avatar/gato-8.png',
        './assets/avatar/gato-9.png',
        './assets/avatar/gato-10.png',
        './assets/avatar/gato-11.png',
        './assets/avatar/gato-12.png',
        './assets/avatar/gato-13.png',
        './assets/avatar/gato-14.png',
        './assets/avatar/humano-1.png',
        './assets/avatar/humano-2.png',
        './assets/avatar/humano-3.png',
        './assets/avatar/humano-4.png',
        './assets/avatar/humano-5.png',
        './assets/avatar/humano-6.png',
        './assets/avatar/humano-7.png',
        './assets/avatar/humano-8.png',
        './assets/avatar/humano-9.png',
        './assets/avatar/humano-10.png'
    ];
    const ProfileAvatar = ({ avatars, onSelect }) => {
    
    if(!avatars) {
        return null;
    }

    return (
        <div className="avatar-selector">
            {avatars.map((avatar, index) => (
                <img
                    key={index}
                    src={avatar}
                    alt={`Avatar-${index}`}
                    onClick={() => onSelect(avatar)}
                />
            ))}
        </div>
    );
};
export { avatarsArray };
export default ProfileAvatar;