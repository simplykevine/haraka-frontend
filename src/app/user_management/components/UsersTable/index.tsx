'use client'
import React, { useState, useMemo } from "react";
import Image from "next/image";
import { useUsers } from "../../../hooks/useFetchUsers";
import { FaUserCircle } from "react-icons/fa";
import dayjs from "dayjs";
import CalendarDropdown from "../../../sharedComponents/CalendarDropdown";
import CustomDropdown from "../DropDown";
import { useThemeSafe } from "../../../context/ThemeContext";

function capitalizeFirstLetter(str: string) {
  if (!str) return "";
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
}

// Validate URL
function isValidUrl(url: string): boolean {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
}

export default function UsersTable() {
  const { theme } = useThemeSafe();
  const { users, loading, error } = useUsers();
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);

  // Theme-aware styles
  const containerBg = theme === 'light' ? 'bg-gray-50' : 'bg-transparent';
  const tableBg = theme === 'light' ? 'bg-white' : 'bg-[#091326]';
  const tableHeaderBg = theme === 'light' ? 'bg-gray-100' : 'bg-[#091326]';
  const tableHeaderText = theme === 'light' ? 'text-gray-900' : 'text-white';
  const tableBorder = theme === 'light' ? 'border-gray-300' : 'border-gray-600';
  const tableRowHover = theme === 'light' ? 'hover:bg-gray-100' : 'hover:bg-gray-800';
  const tableRowBorder = theme === 'light' ? 'border-gray-200' : 'border-gray-700';
  const tableCellText = theme === 'light' ? 'text-gray-900' : 'text-white';
  const nameText = theme === 'light' ? 'text-blue-600' : 'text-teal-400';
  const emailText = theme === 'light' ? 'text-gray-600' : 'text-white';
  const inputBg = theme === 'light' ? 'bg-white' : 'bg-gray-700';
  const inputBorder = theme === 'light' ? 'border-gray-300' : 'border-gray-400';
  const inputText = theme === 'light' ? 'text-gray-900' : 'text-white';
  const loadingSpinner = theme === 'light' ? 'border-t-blue-500 border-b-blue-500' : 'border-t-cyan-500 border-b-cyan-500';
  const loadingText = theme === 'light' ? 'text-gray-700' : 'text-[#A1B1D6]';
  const errorBg = theme === 'light' ? 'bg-red-100' : 'bg-red-600';
  const errorText = theme === 'light' ? 'text-red-800' : 'text-white';
  const noResultsText = theme === 'light' ? 'text-gray-700' : 'text-white';
  const iconColor = theme === 'light' ? '#0ea5e9' : '#9FF8F8';

  const roles = useMemo(
    () =>
      Array.from(new Set(users.map((u) => u.role))).filter(Boolean),
    [users]
  );

  const filteredUsers = useMemo(() => {
    return users.filter((user) => {
      const matchesSearch =
        user.first_name.toLowerCase().includes(search.toLowerCase()) ||
        user.last_name.toLowerCase().includes(search.toLowerCase()) ||
        user.email.toLowerCase().includes(search.toLowerCase());
      const matchesRole = roleFilter === "all" ? true : user.role === roleFilter;

      const signupDate = dayjs(user.created_at);
      const matchesDate = !startDate || !endDate ? true : signupDate.isAfter(dayjs(startDate).subtract(1, 'day')) &&
        signupDate.isBefore(dayjs(endDate).add(1, 'day'));

      return matchesSearch && matchesRole && matchesDate;
    });
  }, [users, search, roleFilter, startDate, endDate]);

  const handleDateChange = (start: Date | null, end: Date | null) => {
    setStartDate(start);
    setEndDate(end);
  };

  if (loading)
    return (
      <div className={`flex flex-col items-center justify-center min-h-screen w-full ${containerBg} transition-colors`}>
        <div className={`rounded-full h-12 w-12 border-t-2 border-b-2 ${loadingSpinner} mb-4 animate-spin transition-colors`}></div>
        <div className={`${loadingText} text-base transition-colors`}>Loading users...</div>
      </div>
    );

  if (error)
    return (
      <div className={`flex flex-col items-center justify-center min-h-screen w-full ${containerBg} transition-colors`}>
        <div className={`${errorBg} ${errorText} p-4 rounded-lg mb-4 transition-colors`}>
          <h2 className="text-lg font-bold mb-2">Error</h2>
          <p>Error loading users: {error}</p>
        </div>
      </div>
    );

  return (
    <div className={`mx-20 ${containerBg} transition-colors`}>
      <div className="flex justify-between 2xl:w-[79vw] xl:w-[80vw]">
        <div className="flex gap-4 items-center ml-20">
          <input
            type="text"
            placeholder="Search by name or email"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className={`2xl:p-2 lg:p-1 rounded border ${inputBorder} ${inputBg} ${inputText} 2xl:w-92 lg:w-60 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors`}
          />
          <CustomDropdown options={roles} selected={roleFilter} onSelect={setRoleFilter} />
        </div>
        <div className="mt-8">
          <CalendarDropdown onDateChange={handleDateChange} />
        </div>
      </div>

      <div className={`overflow-auto 2xl:max-h-[450px] lg:max-h-[230px] xl:max-h-[270px] xl:mt-3 shadow-md border-2 ${tableBorder} rounded-md w-[75vw] ml-20 2xl:mt-6 transition-colors`}>
        <table className={`w-full border-collapse ${tableBg} transition-colors`}>
          <thead className={`sticky top-0 ${tableHeaderBg} transition-colors`}>
            <tr>
              <th className={`2xl:p-4 lg:py-1 pl-9 w-[350px] ${tableHeaderText} text-left lg:text-xl 2xl:text-3xl font-medium transition-colors`}>
                Users
              </th>
              <th className={`2xl:p-4 lg:py-1 pl-18 w-[350px] ${tableHeaderText} text-left lg:text-xl 2xl:text-3xl font-medium transition-colors`}>
                Roles
              </th>
              <th className={`2xl:p-4 lg:py-1 w-[150px] ${tableHeaderText} text-left lg:text-xl 2xl:text-3xl font-medium transition-colors`}>
                Sign up date
              </th>
            </tr>
          </thead>

          <tbody>
            {filteredUsers.length === 0 ? (
              <tr>
                <td colSpan={3} className={`${noResultsText} p-2 text-center transition-colors`}>
                  No users found.
                </td>
              </tr>
            ) : (
              filteredUsers.map((user, idx) => (
                <tr
                  key={idx}
                  className={`border-b ${tableRowBorder} last:border-none ${tableRowHover} transition-colors`}
                >
                  <td className="px-1">
                    <div className="flex items-center gap-2 ml-2 lg:gap-1 lg:ml-1 xl:gap-3 xl:ml-6">
                      {user.image && isValidUrl(user.image) ? (
                        <Image
                          src={user.image}
                          alt={`${user.first_name} ${user.last_name}`}
                          width={40}
                          height={40}
                          className="rounded-full w-8 h-8 lg:w-6 lg:h-6 xl:w-8 xl:h-8 2xl:w-12 2xl:h-12 object-cover"
                          onError={(e) => {
                            e.currentTarget.style.display = 'none';
                          }}
                        />
                      ) : (
                        <FaUserCircle
                          size={40}
                          className="lg:w-6 lg:h-6 xl:w-8 xl:h-8 2xl:w-12 2xl:h-12"
                          color={iconColor}
                        />
                      )}

                      <div className="ml-4 lg:ml-2 xl:ml-7">
                        <div className={`${nameText} text-base lg:text-sm xl:text-lg 2xl:text-[22px] transition-colors`}>
                          {capitalizeFirstLetter(user.first_name)} {capitalizeFirstLetter(user.last_name)}
                        </div>
                        <div className={`text-xs lg:text-[10px] xl:text-base 2xl:text-[18px] ${emailText} transition-colors`}>
                          {user.email}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td>
                    <div className={`${tableCellText} text-base lg:text-sm xl:text-xl 2xl:text-2xl ml-8 lg:ml-4 xl:ml-16 transition-colors`}>
                      {user.role}
                    </div>
                  </td>
                  <td className={`p-4 lg:p-2 2xl:p-8 ${tableCellText} text-base lg:text-sm xl:text-md 2xl:text-[20px] ml-2 lg:ml-1 xl:ml-5 transition-colors`}>
                    {dayjs(user.created_at).format("YYYY-MM-DD")}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}