'use client';

import React, { useState, useEffect } from 'react';
import useFetchAdmins from '../hooks/useFetchAdmin';
import { useThemeSafe } from '../context/ThemeContext';
import { AiOutlineEye, AiOutlineEyeInvisible, AiOutlineArrowLeft, AiOutlineCamera } from 'react-icons/ai';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

interface UserType {
  id?: string | number;
  user_id?: string | number;
  role?: string;
  first_name?: string;
  last_name?: string;
  firstName?: string;
  lastName?: string;
  email?: string;
  image?: string;
  date_joined?: string;
  registeredDate?: string;
  created_at?: string;
  password?: string;
  [key: string]: unknown;
}

interface FormData {
  role?: string;
  first_name?: string;
  last_name?: string;
  email?: string;
  date_joined?: string;
  image?: string;
  password?: string;
  [key: string]: string | undefined;
}

type SnakeCaseData = {
  role?: string;
  first_name?: string;
  last_name?: string;
  email?: string;
  image?: string;
  date_joined?: string;
  password: string;
};

interface ApiError {
  message?: string;
  email?: string[];
}

const ProfilePage = () => {
  const { theme } = useThemeSafe();
  const { user, loading, error, updateAdmin, refetch } = useFetchAdmins();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<FormData>({});
  const [originalData, setOriginalData] = useState<FormData>({});
  const [showPassword, setShowPassword] = useState(false);
  const [status, setStatus] = useState<string | null>(null);
  const [emailError, setEmailError] = useState<string | null>(null);
  const router = useRouter();
  const bgColor = theme === 'light' ? 'bg-gray-50' : 'bg-transparent';
  const textPrimary = theme === 'light' ? 'text-gray-900' : 'text-white';
  const textSecondary = theme === 'light' ? 'text-gray-600' : 'text-zinc-100';
  const headerBg = theme === 'light' ? 'bg-white' : '#0F243D';
  const borderColor = theme === 'light' ? 'border-gray-300' : 'border-white';
  const backButtonBg = theme === 'light' ? 'border-blue-400 text-blue-600 hover:bg-blue-100 hover:text-blue-700' : 'border-cyan-300 text-cyan-300 hover:bg-cyan-200 hover:text-[#0F243D]';
  const backButtonIcon = theme === 'light' ? 'text-blue-400 hover:text-blue-700' : 'text-cyan-300 hover:text-[#0F243D]';
  const cardBg = theme === 'light' ? 'bg-white' : '#0F243D';
  const cardBorder = theme === 'light' ? 'border-gray-300' : 'border-none';
  const labelText = theme === 'light' ? 'text-blue-600' : 'text-cyan-300';
  const inputBg = theme === 'light' ? 'bg-gray-100' : 'bg-gray-700';
  const inputBorder = theme === 'light' ? 'border-gray-300' : 'border-gray-600';
  const inputText = theme === 'light' ? 'text-gray-900' : 'text-white';
  const inputFocus = theme === 'light' ? 'focus:ring-blue-500' : 'focus:ring-cyan-500';
  const updateButtonBg = theme === 'light' ? 'bg-blue-300 text-blue-700 hover:bg-blue-200' : 'bg-orange-300 text-orange-700 hover:bg-white';
  const cancelButtonText = theme === 'light' ? 'text-red-600 hover:text-red-800' : 'text-red-400 hover:text-red-300';
  const saveButtonBg = theme === 'light' ? 'bg-green-500 text-white hover:bg-green-600' : 'bg-green-500 text-white hover:bg-green-600';
  const saveButtonDisabled = theme === 'light' ? 'bg-gray-400 text-gray-200 cursor-not-allowed' : 'bg-gray-500 text-gray-300 cursor-not-allowed';
  const statusSuccessBg = theme === 'light' ? 'bg-green-100 text-green-800' : 'bg-green-600 text-white';
  const statusWarningBg = theme === 'light' ? 'bg-yellow-100 text-yellow-800' : 'bg-yellow-600 text-white';
  const statusErrorBg = theme === 'light' ? 'bg-red-100 text-red-800' : 'bg-red-600 text-white';
  const hrColor = theme === 'light' ? 'border-gray-300' : 'border-gray-700';
  const loadingSpinner = theme === 'light' ? 'border-t-blue-500 border-b-blue-500' : 'border-t-cyan-500 border-b-cyan-500';
  const loadingText = theme === 'light' ? 'text-gray-900' : 'text-white';
  const errorBg = theme === 'light' ? 'bg-red-100' : 'bg-red-600';
  const errorText = theme === 'light' ? 'text-red-800' : 'text-white';
  const retryButton = theme === 'light' ? 'bg-blue-600 text-white hover:bg-blue-700' : 'bg-cyan-500 text-white hover:bg-cyan-600';
  const cameraButtonBg = theme === 'light' ? 'bg-blue-400 hover:bg-gray-100 text-blue-700' : 'bg-cyan-400 hover:bg-gray-100 text-[#0F243D]';

  function getSafeId(userObj: UserType): string | number | undefined {
    if (typeof userObj?.id === 'string' || typeof userObj?.id === 'number') return userObj.id;
    if (typeof userObj?.user_id === 'string' || typeof userObj?.user_id === 'number') return userObj.user_id;
    return undefined;
  }

  function getString(val: unknown): string {
    return typeof val === 'string' ? val : '';
  }

  useEffect(() => {
    if (user) {
      const initialData = {
        role: getString(user.role),
        first_name: getString(user.first_name ?? (user as UserType).firstName),
        last_name: getString(user.last_name ?? (user as UserType).lastName),
        email: getString(user.email),
        date_joined: getString(user.date_joined ?? user.registeredDate ?? user.created_at),
        image: getString(user.image),
        password: ''
      };
      setFormData(initialData);
      setOriginalData(initialData);
    }
  }, [user]);

  const handleEditClick = () => setIsEditing(true);

  const handleCancel = () => {
    setIsEditing(false);
    setStatus(null);
    setEmailError(null);
    if (user) {
      const resetData = {
        role: getString(user.role),
        first_name: getString(user.first_name ?? (user as UserType).firstName),
        last_name: getString(user.last_name ?? (user as UserType).lastName),
        email: getString(user.email),
        date_joined: getString(user.date_joined ?? user.registeredDate ?? user.created_at),
        image: getString(user.image),
        password: ''
      };
      setFormData(resetData);
      setOriginalData(resetData);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    if (name === 'email') {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (value && !emailRegex.test(value)) {
        setEmailError('Please put a valid email');
      } else {
        setEmailError(null);
      }
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prev => ({
          ...prev,
          image: reader.result as string
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const hasChanges = (): boolean => {
    return (
      formData.first_name !== originalData.first_name ||
      formData.last_name !== originalData.last_name ||
      formData.email !== originalData.email ||
      formData.image !== originalData.image
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    if (!hasChanges()) {
      setStatus('No changes detected.');
      setTimeout(() => setStatus(null), 2000);
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email || !emailRegex.test(formData.email)) {
      setEmailError('Please put a valid email');
      return;
    }

    if (!formData.password || formData.password.trim() === '') {
      setStatus('Password is required to update the profile.');
      return;
    }

    const snakeCaseData: SnakeCaseData = {
      role: formData.role ?? '',
      first_name: formData.first_name ?? '',
      last_name: formData.last_name ?? '',
      email: formData.email ?? '',
      image: formData.image ?? '',
      date_joined: formData.date_joined ?? '',
      password: formData.password,
    };

    const safeId = getSafeId(user as UserType);
    if (safeId !== undefined) {
      try {
        const updatedUser = await updateAdmin(safeId, snakeCaseData);
        if (!updatedUser) {
          setStatus('Update failed.');
          setTimeout(() => setStatus(null), 2000);
          return;
        }
        const newFormData = {
          role: getString(updatedUser.role),
          first_name: getString(updatedUser.first_name),
          last_name: getString(updatedUser.last_name),
          email: getString(updatedUser.email),
          date_joined: getString(updatedUser.date_joined ?? updatedUser.registeredDate ?? updatedUser.created_at),
          image: getString(updatedUser.image),
          password: ''
        };
        setFormData(newFormData);
        setOriginalData(newFormData);
        setIsEditing(false);
        setStatus('Profile updated successfully!');
        setTimeout(() => setStatus(null), 2000);
      } catch (err) {
        const error = err as ApiError;
        if (error?.email) {
          setEmailError(error.email[0]);
        } else {
          setStatus('Update failed.');
          setTimeout(() => setStatus(null), 2000);
        }
      }
    } else {
      setStatus('User ID not found.');
      setTimeout(() => setStatus(null), 2000);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(prev => !prev);
  };

  const handleBack = () => {
    router.back();
  };

  const displayImage = formData.image || '/images/avatare.png';

  if (loading) {
    return (
      <div className={`min-h-screen w-full flex items-center justify-center px-4 sm:px-6 lg:px-8 ${bgColor} transition-colors`}>
        <div className="text-center">
          <div className={`rounded-full h-12 w-12 sm:h-16 sm:w-16 border-t-2 border-b-2 ${loadingSpinner} mx-auto mb-4 animate-spin transition-colors`}></div>
          <p className={`${loadingText} text-base sm:text-lg transition-colors`}>Loading profile...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8 ${bgColor} transition-colors`}>
        <div className="text-center">
          <div className={`${errorBg} ${errorText} p-4 sm:p-6 rounded-lg mb-4 transition-colors`}>
            <h2 className="text-lg sm:text-xl font-bold mb-2">Error</h2>
            <p>{error}</p>
          </div>
          <button
            onClick={refetch}
            className={`px-4 py-2 ${retryButton} rounded transition-colors text-sm sm:text-base`}
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className={`min-h-screen w-full flex items-center justify-center px-4 sm:px-6 lg:px-8 lg:py-1 ${bgColor} transition-colors`}>
        <div className={`${textPrimary} text-base sm:text-lg transition-colors`}>User not found</div>
      </div>
    );
  }

  return (
    <div className={`relative overflow-hidden bg-cover xl:mt-20 lg:mt-2 2xl:mt-40 bg-center -mt-4 sm:-mt-6 lg:-mt-8 ${bgColor} transition-colors`}>
      <div className="fixed top-9 left-9 z-30">
        <button
          onClick={handleBack}
          className={`${backButtonBg} flex items-center gap-2 px-3 py-1 border rounded-full transition-colors duration-200 font-semibold cursor-pointer`}
        >
          <AiOutlineArrowLeft size={22} className={`${backButtonIcon} transition-colors`} />
          <span className="text-base font-medium tracking-wide">Back</span>
        </button>
      </div>

      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <header className="mt-8 sm:mt-12 flex flex-col sm:flex-row justify-between items-center mb-4 sm:mb-6 lg:mb-8">
          <div className="text-center sm:text-left">
            <h1 className={`text-2xl sm:text-3xl lg:text-4xl font-bold ${textPrimary} transition-colors`}>
              Profile
            </h1>
            <p className={`text-xs sm:text-sm lg:text-base mt-1 ${textSecondary} transition-colors`}>
              View your profile
            </p>
          </div>
        </header>

        <div className={`w-full h-px mb-6 sm:mb-8 lg:mb-10 border-t border-dashed ${borderColor} transition-colors`}></div>

        <div className="flex flex-col lg:flex-row gap-4 sm:gap-6">
          <div className="flex-1 flex justify-center mb-6 lg:mb-0">
            <div className={`${cardBg} rounded-3xl pt-6 sm:pt-10 lg:pt-14 shadow-lg border ${cardBorder} max-w-xs sm:max-w-sm w-full transition-colors`}>
              <div className="relative flex justify-center">
                <div className="relative">
                  <Image
                    src={displayImage}
                    alt="Profile"
                    width={192}
                    height={192}
                    className="w-24 h-24 sm:w-32 sm:h-32 lg:w-48 lg:h-48 xl:w-64 xl:h-64 rounded-full border-4 border-cyan-400 object-cover"
                  />
                  {isEditing && (
                    <label className={`absolute bottom-2 right-2 ${cameraButtonBg} rounded-full p-2 cursor-pointer shadow-lg transition-colors`}>
                      <AiOutlineCamera size={18} />
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageChange}
                        className="hidden"
                      />
                    </label>
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className="flex-1">
            <div className={`${cardBg} rounded-3xl p-3 sm:p-4 lg:p-6 shadow-lg transition-colors`}>
              <div className="flex justify-between items-center mb-3 sm:mb-4">
                <h2 className={`text-xl sm:text-2xl lg:text-3xl font-bold ${textPrimary} transition-colors`}>
                  Details
                </h2>
                {!isEditing ? (
                  <button
                    onClick={handleEditClick}
                    className={`${updateButtonBg} px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg transition-colors duration-200 cursor-pointer text-sm sm:text-base`}
                  >
                    Update
                  </button>
                ) : (
                  <div className="flex gap-2 sm:gap-3">
                    <button
                      onClick={handleCancel}
                      className={`${cancelButtonText} px-3 sm:px-4 py-1.5 sm:py-2 transition-colors duration-200 cursor-pointer text-sm sm:text-base`}
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleSubmit}
                      disabled={!hasChanges()}
                      className={`${hasChanges() ? saveButtonBg : saveButtonDisabled} px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg text-sm sm:text-base transition-colors duration-200 cursor-pointer`}
                    >
                      Save
                    </button>
                  </div>
                )}
              </div>

              {status && (
                <div
                  className={`mb-3 sm:mb-4 px-4 py-2 rounded text-center text-sm sm:text-base transition-colors ${
                    status.includes('success')
                      ? statusSuccessBg
                      : status.includes('No changes')
                      ? statusWarningBg
                      : statusErrorBg
                  }`}
                >
                  {status}
                </div>
              )}

              <form onSubmit={handleSubmit}>
                <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 mb-3 sm:mb-4">
                  <div className="flex-1">
                    <label className={`block text-sm sm:text-base lg:text-lg ${labelText} mb-2 transition-colors`}>
                      Role
                    </label>
                    <p className={`${textPrimary} text-sm sm:text-base transition-colors`}>{formData.role}</p>
                  </div>
                  <div className="flex-1">
                    <label className={`block text-sm sm:text-base lg:text-lg ${labelText} mb-2 transition-colors`}>
                      Registered date
                    </label>
                    <p className={`${textPrimary} text-sm sm:text-base transition-colors`}>
                      {formData.date_joined
                        ? new Date(formData.date_joined).toLocaleDateString()
                        : 'Not specified'}
                    </p>
                  </div>
                </div>
                <hr className={`${hrColor} my-3 sm:my-4 transition-colors`} />

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 mb-3 sm:mb-4">
                  <div>
                    <label className={`block text-sm sm:text-base lg:text-lg ${labelText} mb-2 transition-colors`}>
                      First Name
                    </label>
                    {isEditing ? (
                      <input
                        type="text"
                        name="first_name"
                        value={formData.first_name || ''}
                        onChange={handleChange}
                        className={`w-full ${inputBg} border ${inputBorder} rounded-lg px-3 py-2 ${inputText} text-sm sm:text-base lg:text-lg focus:outline-none focus:ring-2 ${inputFocus} transition-colors`}
                      />
                    ) : (
                      <p className={`${textPrimary} text-base sm:text-lg lg:text-xl transition-colors`}>
                        {formData.first_name || 'Not specified'}
                      </p>
                    )}
                  </div>
                  <div>
                    <label className={`block text-sm sm:text-base lg:text-lg ${labelText} mb-2 transition-colors`}>
                      Last Name
                    </label>
                    {isEditing ? (
                      <input
                        type="text"
                        name="last_name"
                        value={formData.last_name || ''}
                        onChange={handleChange}
                        className={`w-full ${inputBg} border ${inputBorder} rounded-lg px-3 py-2 ${inputText} text-sm sm:text-base lg:text-lg focus:outline-none focus:ring-2 ${inputFocus} transition-colors`}
                      />
                    ) : (
                      <p className={`${textPrimary} text-base sm:text-lg lg:text-xl transition-colors`}>
                        {formData.last_name || 'Not specified'}
                      </p>
                    )}
                  </div>
                </div>
                <hr className={`${hrColor} my-3 sm:my-4 transition-colors`} />

                <div className="mb-3 sm:mb-4">
                  <label className={`block text-sm sm:text-base lg:text-lg ${labelText} mb-2 transition-colors`}>
                    Email
                  </label>
                  {isEditing ? (
                    <input
                      type="email"
                      name="email"
                      value={formData.email || ''}
                      onChange={handleChange}
                      className={`w-full ${inputBg} border ${inputBorder} rounded-lg px-3 py-2 ${inputText} text-sm sm:text-base lg:text-lg focus:outline-none focus:ring-2 ${inputFocus} transition-colors`}
                    />
                  ) : (
                    <p className={`${textPrimary} text-base sm:text-lg lg:text-xl transition-colors`}>
                      {formData.email || 'Not specified'}
                    </p>
                  )}
                  {isEditing && emailError && (
                    <p className="text-red-500 text-sm mt-1">{emailError}</p>
                  )}
                </div>
                <hr className={`${hrColor} my-3 sm:my-4 transition-colors`} />

                {isEditing && (
                  <div className="mb-3 sm:mb-6 lg:mb-8">
                    <label className={`block text-sm sm:text-base lg:text-lg ${labelText} mb-2 transition-colors`}>
                      Password (required for update)
                    </label>
                    <div className="relative">
                      <input
                        type={showPassword ? 'text' : 'password'}
                        name="password"
                        value={formData.password || ''}
                        onChange={handleChange}
                        className={`w-full ${inputBg} border ${inputBorder} rounded-lg px-3 py-2 ${inputText} text-sm sm:text-base lg:text-lg focus:outline-none focus:ring-2 ${inputFocus} transition-colors`}
                      />
                      <button
                        type="button"
                        onClick={togglePasswordVisibility}
                        className={`absolute inset-y-0 right-0 flex items-center pr-3 ${textPrimary} transition-colors`}
                      >
                        {showPassword ? (
                          <AiOutlineEyeInvisible size={20} className="w-5 sm:w-6 h-5 sm:h-6" />
                        ) : (
                          <AiOutlineEye size={20} className="w-5 sm:w-6 h-5 sm:h-6" />
                        )}
                      </button>
                    </div>
                  </div>
                )}
              </form>
            </div>
          </div>
        </div>

        <div className={`w-full h-px mt-6 sm:mt-8 lg:mt-10 border-t border-dashed ${borderColor} transition-colors`}></div>
      </div>
    </div>
  );
};

export default ProfilePage;