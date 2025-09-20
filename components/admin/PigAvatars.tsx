"use client";

// Colección de 12 avatares de cerditos, ahora generados como círculos
const Avatar = ({ className = "h-12 w-12", children }: { className?: string; children: React.ReactNode }) => (
  <div className={`relative ${className}`}>{children}</div>
);

// Añadimos el parámetro "radius=50" a la URL para hacerlos circulares
export const PigAvatar1 = ({ className }: { className?: string }) => <Avatar className={className}><img src="https://api.dicebear.com/7.x/adventurer/svg?seed=Peanut&backgroundColor=ffdfb3&radius=50" alt="Avatar 1" /></Avatar>;
export const PigAvatar2 = ({ className }: { className?: string }) => <Avatar className={className}><img src="https://api.dicebear.com/7.x/adventurer/svg?seed=Missy&backgroundColor=d1d4f9&radius=50" alt="Avatar 2" /></Avatar>;
export const PigAvatar3 = ({ className }: { className?: string }) => <Avatar className={className}><img src="https://api.dicebear.com/7.x/adventurer/svg?seed=Tinkerbell&backgroundColor=ffd5dc&radius=50" alt="Avatar 3" /></Avatar>;
export const PigAvatar4 = ({ className }: { className?: string }) => <Avatar className={className}><img src="https://api.dicebear.com/7.x/adventurer/svg?seed=Coco&backgroundColor=b6e3f4&radius=50" alt="Avatar 4" /></Avatar>;
export const PigAvatar5 = ({ className }: { className?: string }) => <Avatar className={className}><img src="https://api.dicebear.com/7.x/adventurer/svg?seed=Midnight&backgroundColor=c0aede&radius=50" alt="Avatar 5" /></Avatar>;
export const PigAvatar6 = ({ className }: { className?: string }) => <Avatar className={className}><img src="https://api.dicebear.com/7.x/adventurer/svg?seed=Leo&backgroundColor=f5d5cb&radius=50" alt="Avatar 6" /></Avatar>;
export const PigAvatar7 = ({ className }: { className?: string }) => <Avatar className={className}><img src="https://api.dicebear.com/7.x/adventurer/svg?seed=Milo&backgroundColor=a0e8d5&radius=50" alt="Avatar 7" /></Avatar>;
export const PigAvatar8 = ({ className }: { className?: string }) => <Avatar className={className}><img src="https://api.dicebear.com/7.x/adventurer/svg?seed=Garfield&backgroundColor=f9e4be&radius=50" alt="Avatar 8" /></Avatar>;
export const PigAvatar9 = ({ className }: { className?: string }) => <Avatar className={className}><img src="https://api.dicebear.com/7.x/adventurer/svg?seed=Snuggles&backgroundColor=f4d35e&radius=50" alt="Avatar 9" /></Avatar>;
export const PigAvatar10 = ({ className }: { className?: string }) => <Avatar className={className}><img src="https://api.dicebear.com/7.x/adventurer/svg?seed=Mimi&backgroundColor=e8c5d3&radius=50" alt="Avatar 10" /></Avatar>;
export const PigAvatar11 = ({ className }: { className?: string }) => <Avatar className={className}><img src="https://api.dicebear.com/7.x/adventurer/svg?seed=Charlie&backgroundColor=c9e2b3&radius=50" alt="Avatar 11" /></Avatar>;
export const PigAvatar12 = ({ className }: { className?: string }) => <Avatar className={className}><img src="https://api.dicebear.com/7.x/adventurer/svg?seed=Oreo&backgroundColor=d4d4d4&radius=50" alt="Avatar 12" /></Avatar>;

export const avatars = {
    avatar1: PigAvatar1, avatar2: PigAvatar2, avatar3: PigAvatar3,
    avatar4: PigAvatar4, avatar5: PigAvatar5, avatar6: PigAvatar6,
    avatar7: PigAvatar7, avatar8: PigAvatar8, avatar9: PigAvatar9,
    avatar10: PigAvatar10, avatar11: PigAvatar11, avatar12: PigAvatar12,
};

export type AvatarKey = keyof typeof avatars;