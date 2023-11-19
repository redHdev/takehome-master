import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useUsers } from '../contexts/UserProvider';

type FormData = {
    firstName: string;
    middleName: string;
    lastName: string;
    email: string;
    phoneNumber: string;
    address: string;
  };
  
  const UserControls: React.FC = () => {
    const { register, handleSubmit, reset, formState: { errors } } = useForm<FormData>();
    const { search, setSearch, fetchMoreUsers, setUsers } = useUsers();
    const [showAddUserModal, setShowAddUserModal] = useState(false);
  
    const onSubmit = async (data: FormData) => {
      const response = await fetch("/api/add-user", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
            registered: new Date(),
            ...data
          }),
      });
      if (response.status === 200) {
        console.log(response, "response");
      }
      reset();
      setShowAddUserModal(false);
    };

    const handleSearch = () => {
      setUsers([]);
      // fetchMoreUsers(search);
    }
  
    return (
        <div className="relative">
        <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="relative flex-grow">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                    <svg className="w-4 h-4 text-gray-500 dark:text-gray-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
                        <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"/>
                    </svg>
                </div>
                <input value={search} onChange={(e) => {setSearch(e.target.value)}} type="search" id="default-search" className="block w-full p-4 pl-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Search Mockups, Logos..." required />
                <button type="submit" onClick = {handleSearch} className="text-white absolute right-2.5 bottom-2.5 bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">Search</button>
            </div>
            <button onClick={() => setShowAddUserModal(true)} className="bg-blue-500 text-white p-2 rounded ml-4 mt-4 md:mt-0">Add User</button>
        </div>

  
        {showAddUserModal && (
          <div className="fixed top-0 left-0 w-full h-full bg-gray-500 bg-opacity-50 flex items-center justify-center">
            <div className="bg-white p-8 rounded shadow-xl w-100">
              <button onClick={() => setShowAddUserModal(false)} className="absolute top-2 right-2 text-gray-400 hover:text-gray-700">&times;</button>
              <h2 className="text-xl mb-4">Add New User</h2>
              <form onSubmit={handleSubmit(onSubmit)}>
                
                <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-6 mb-4">
                    <div className="flex-1 flex flex-col space-y-2">
                        <label className="text-sm font-semibold text-left">First Name <span className="text-red-500">*</span></label>
                        <input className={`border p-2 rounded w-full ${errors.firstName ? 'border-red-500' : 'border-gray-300'}`} {...register('firstName', {required : true})} />
                        {errors.firstName && <span className="text-red-500 text-sm text-[14px]">This field is required</span>}
                    </div>
                    <div className="flex-1 flex flex-col space-y-2">
                        <label className="text-sm font-semibold text-left">Middle Name</label>
                        <input className={`border p-2 rounded w-full`} {...register('middleName')} />
                    </div>
                    <div className="flex-1 flex flex-col space-y-2">
                        <label className="text-sm font-semibold text-left">Last Name <span className="text-red-500">*</span></label>
                        <input className={`border p-2 rounded w-full ${errors.lastName ? 'border-red-500' : 'border-gray-300'}`} {...register('lastName', {required : true})} />
                        {errors.lastName && <span className="text-red-500 text-sm text-[14px]">This field is required</span>}
                    </div>
                </div>
                
                <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-6 mb-4">
                    <div className="flex-1 flex flex-col space-y-2">
                        <label className="text-sm font-semibold text-left">Email <span className="text-red-500">*</span></label>
                        <input className={`border p-2 rounded w-full ${errors.email ? 'border-red-500' : 'border-gray-300'}`} {...register('email', {required : true})} />
                        {errors.email && <span className="text-red-500 text-sm text-[14px]">This field is required</span>}
                    </div>
                    <div className="flex-1 flex flex-col space-y-2">
                        <label className="text-sm font-semibold text-left">Phone Number</label>
                        <input className={`border p-2 rounded w-full`} {...register('phoneNumber')} />
                    </div>
                </div>
                
                <div className="flex flex-col space-y-2 mb-4">
                    <label className="text-sm font-semibold text-left">Address</label>
                    <input className="border p-2 rounded w-full border-gray-300" {...register('address')} />
                </div>
                
                <div className="flex justify-between">
                  <button type="submit" className="bg-green-500 text-white p-2 rounded">Submit</button>
                  <button type="button" onClick={() => {setShowAddUserModal(false); reset();}} className="bg-red-500 text-white p-2 rounded">Cancel</button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
      );
  };
  
  export default UserControls;