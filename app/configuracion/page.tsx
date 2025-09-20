"use client";

import { useEffect, useState } from "react";
import { useAdminGate } from "@/hooks/useAdmins";
import AuthGate from "@/components/AuthGate";
import { updateProfile, reauthenticateWithCredential, EmailAuthProvider, updatePassword, deleteUser } from "firebase/auth";
import { auth } from "@/lib/firebase/firebase";
import { doc, updateDoc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase/client";
import { avatars, AvatarKey } from "@/components/admin/PigAvatars";

// --- Iconos ---
const UserIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>;
const LockIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>;
const PaintBrushIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.536L15.232 5.232z" /></svg>;

export default function ConfiguracionPage() {
    const { user, loading, allowed } = useAdminGate();
    const [displayName, setDisplayName] = useState("");
    const [userAvatar, setUserAvatar] = useState<AvatarKey | null>(null);
    const [currentPassword, setCurrentPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [deleteConfirm, setDeleteConfirm] = useState("");
    const [isSaving, setIsSaving] = useState(false);
    const [activeTab, setActiveTab] = useState('perfil');
    const [successMessage, setSuccessMessage] = useState("");
    const [errorMessage, setErrorMessage] = useState("");

    useEffect(() => {
        if (user) {
            setDisplayName(user.displayName || "");
            const userRef = doc(db, 'users', user.uid);
            getDoc(userRef).then(docSnap => {
                if (docSnap.exists() && docSnap.data().avatar) {
                    setUserAvatar(docSnap.data().avatar);
                } else {
                    setUserAvatar('avatar1'); // Avatar por defecto
                }
            });
        }
    }, [user]);

    const clearMessages = () => { setSuccessMessage(""); setErrorMessage(""); };

    const handleProfileUpdate = async (e: React.FormEvent) => {
        e.preventDefault(); clearMessages(); if (!user) return;
        setIsSaving(true);
        try {
            if (displayName !== user.displayName) {
                await updateProfile(user, { displayName });
                await updateDoc(doc(db, "users", user.uid), { displayName });
            }
            setSuccessMessage("¡Perfil actualizado con éxito!");
        } catch (error) { setErrorMessage("Error al actualizar el perfil."); }
        setIsSaving(false);
    };

    const handleAvatarUpdate = async (avatarKey: AvatarKey) => {
        clearMessages(); if (!user) return;
        const newPhotoURL = `https://api.dicebear.com/7.x/adventurer/svg?seed=${avatarKey}&radius=50`;
        setUserAvatar(avatarKey);
        try {
            await updateProfile(user, { photoURL: newPhotoURL });
            await updateDoc(doc(db, "users", user.uid), { avatar: avatarKey, photoURL: newPhotoURL });
            setSuccessMessage("¡Avatar actualizado!");
        } catch (error) { 
            console.error(error);
            setErrorMessage("Error al guardar el avatar."); 
        }
    };

    const handlePasswordUpdate = async (e: React.FormEvent) => {
        e.preventDefault(); clearMessages(); if (!user || !user.email) return;
        if (newPassword !== confirmPassword) { setErrorMessage("Las nuevas contraseñas no coinciden."); return; }
        setIsSaving(true);
        const credential = EmailAuthProvider.credential(user.email, currentPassword);
        try {
            await reauthenticateWithCredential(user, credential);
            await updatePassword(user, newPassword);
            setSuccessMessage("¡Contraseña actualizada!");
            setCurrentPassword(""); setNewPassword(""); setConfirmPassword("");
        } catch (error) { setErrorMessage("Error: La contraseña actual es incorrecta."); }
        setIsSaving(false);
    };

    const handleDeleteAccount = async (e: React.FormEvent) => {
        e.preventDefault(); clearMessages(); if (!user || !user.email) return;
        if (deleteConfirm !== "ELIMINAR") { setErrorMessage("Escribe ELIMINAR para confirmar."); return; }
        setIsSaving(true);
        const credential = EmailAuthProvider.credential(user.email, currentPassword);
        try {
            await reauthenticateWithCredential(user, credential);
            await deleteUser(user);
        } catch (error) { setErrorMessage("Contraseña incorrecta. No se pudo eliminar la cuenta."); setIsSaving(false); }
    };

    if (loading) {
      return <div className="min-h-screen grid place-items-center"><p>Cargando configuración...</p></div>;
    }

    return (
        <AuthGate>
            <main className="mx-auto max-w-5xl px-4 py-12">
                <header className="mb-10">
                    <h1 className="text-4xl font-extrabold tracking-tight text-[#8B5E34]">Configuración</h1>
                    <p className="text-lg text-[#6B625B] mt-2">Gestiona tu cuenta y las preferencias del sitio.</p>
                </header>

                {successMessage && <div className="mb-6 bg-green-100 border-l-4 border-green-500 text-green-700 p-4 rounded-md" role="alert">{successMessage}</div>}
                {errorMessage && <div className="mb-6 bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded-md" role="alert">{errorMessage}</div>}

                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                    <aside className="md:col-span-1">
                        <nav className="space-y-1">
                            <button onClick={() => {setActiveTab('perfil'); clearMessages();}} className={`w-full flex items-center gap-3 px-3 py-2 text-md font-medium rounded-lg transition ${activeTab === 'perfil' ? 'bg-[#FFF8F2] text-[#6F4421]' : 'text-gray-600 hover:bg-[#FFF8F2]'}`}><UserIcon /> Perfil</button>
                            {allowed && <button onClick={() => {setActiveTab('avatar'); clearMessages();}} className={`w-full flex items-center gap-3 px-3 py-2 text-md font-medium rounded-lg transition ${activeTab === 'avatar' ? 'bg-[#FFF8F2] text-[#6F4421]' : 'text-gray-600 hover:bg-[#FFF8F2]'}`}><PaintBrushIcon /> Avatar</button>}
                            <button onClick={() => {setActiveTab('seguridad'); clearMessages();}} className={`w-full flex items-center gap-3 px-3 py-2 text-md font-medium rounded-lg transition ${activeTab === 'seguridad' ? 'bg-[#FFF8F2] text-[#6F4421]' : 'text-gray-600 hover:bg-[#FFF8F2]'}`}><LockIcon /> Seguridad</button>
                        </nav>
                    </aside>
                    <div className="md:col-span-3">
                        {activeTab === 'perfil' && (
                            <div className="card p-6">
                                <h2 className="text-2xl font-bold text-[#8B5E34]">Información de Perfil</h2>
                                <form onSubmit={handleProfileUpdate} className="mt-6 space-y-4">
                                    <div><label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Correo Electrónico</label><input id="email" type="email" value={user?.email || ""} disabled className="mt-1 input-style bg-gray-100 cursor-not-allowed dark:bg-slate-700" /></div>
                                    <div><label htmlFor="displayName" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Nombre para mostrar</label><input id="displayName" type="text" value={displayName} onChange={(e) => setDisplayName(e.target.value)} className="mt-1 input-style" /></div>
                                    <div className="text-right"><button type="submit" disabled={isSaving} className="btn-primary">{isSaving ? "Guardando..." : "Guardar Cambios"}</button></div>
                                </form>
                            </div>
                        )}
                        {activeTab === 'avatar' && allowed && (
                            <div className="card p-6">
                                <h2 className="text-2xl font-bold text-[#8B5E34]">Elige tu Avatar</h2>
                                <p className="text-sm text-[#6B625B] mt-1 mb-6">Este avatar te representará en el sitio.</p>
                                <div className="grid grid-cols-4 sm:grid-cols-6 gap-4">
                                    {Object.keys(avatars).map((key) => {
                                        const AvatarComponent = avatars[key as AvatarKey];
                                        return (<button key={key} onClick={() => handleAvatarUpdate(key as AvatarKey)} className={`p-2 rounded-full transition ring-offset-2 ${userAvatar === key ? 'ring-2 ring-pink-500' : 'hover:ring-2 hover:ring-pink-300'}`}><AvatarComponent /></button>);
                                    })}
                                </div>
                            </div>
                        )}
                        {activeTab === 'seguridad' && (
                            <div className="space-y-8">
                                <div className="card p-6">
                                    <h2 className="text-2xl font-bold text-[#8B5E34]">Cambiar Contraseña</h2>
                                    <form onSubmit={handlePasswordUpdate} className="mt-6 space-y-4">
                                        <div><label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Contraseña Actual</label><input type="password" value={currentPassword} onChange={e => setCurrentPassword(e.target.value)} required className="mt-1 input-style" /></div>
                                        <div><label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Nueva Contraseña</label><input type="password" value={newPassword} onChange={e => setNewPassword(e.target.value)} required className="mt-1 input-style" /></div>
                                        <div><label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Confirmar</label><input type="password" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} required className="mt-1 input-style" /></div>
                                        <div className="text-right"><button type="submit" disabled={isSaving} className="btn-primary">{isSaving ? "Actualizando..." : "Actualizar Contraseña"}</button></div>
                                    </form>
                                </div>
                                <div className="card p-6 border-2 border-red-300">
                                    <h2 className="text-2xl font-bold text-red-700">Zona de Peligro</h2>
                                    <form onSubmit={handleDeleteAccount} className="mt-6 space-y-4">
                                        <div><label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Contraseña Actual</label><input type="password" value={currentPassword} onChange={e => setCurrentPassword(e.target.value)} required className="mt-1 input-style" /></div>
                                        <div><label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Escribe "ELIMINAR" para confirmar</label><input type="text" value={deleteConfirm} onChange={e => setDeleteConfirm(e.target.value)} required className="mt-1 input-style" /></div>
                                        <div className="text-right"><button type="submit" disabled={isSaving} className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-md disabled:opacity-50">{isSaving ? "Eliminando..." : "Eliminar mi Cuenta"}</button></div>
                                    </form>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </main>
        </AuthGate>
    );
}