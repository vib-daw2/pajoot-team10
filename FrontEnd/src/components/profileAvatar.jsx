import React from 'react';

const ProfileAvatar = ({ avatars, onSelect }) => {
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

export default ProfileAvatar;