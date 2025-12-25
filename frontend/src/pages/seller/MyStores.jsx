import React, { useState } from 'react';
import { Plus } from 'lucide-react';

const MyStores = () => {



    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">My Stores
                    </h1>
                    <p className="text-gray-600 mt-1">
                        Manage your connected Shopify stores
                    </p>
                </div>
                <div className="flex items-center space-x-3">

                    <button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-md font-semibold flex items-center transition-colors">
                        <Plus className="w-4 h-4 mr-2" />
                        Connect Store
                    </button>
                </div>
            </div>

            <div className="bg-white rounded-md p-4 shadow-sm border border-gray-100">
                <div className="flex items-center ">

                    <span className="text-m text-gray-500">
                        Showing stores for user:
                    </span>
                    <h3 className="text-lg font-semibold text-gray-900">
                        SainathPhondke
                    </h3>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white border border-gray-200 rounded-md p-6 shadow-sm">
                    {/* Header */}
                    <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center gap-3">
                            <div className="w-12 h-12 bg-blue-100 rounded-md flex items-center justify-center">
                                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                                </svg>
                            </div>
                            <div>
                                <h3 className="text-lg font-semibold text-gray-900">Shopillion</h3>
                            </div>
                        </div>
                        <button className="bg-blue-600 text-white px-4 py-1.5 rounded-full text-sm font-medium">
                            direct
                        </button>
                    </div>

                    {/* URL */}
                    <div className="text-gray-600 text-sm mb-4">
                        vqs57x-wq.myshopify.com
                    </div>

                    {/* Connection Info */}
                    <div className="text-sm text-gray-500 space-y-1 mb-6">
                        <div>Connected: Aug 24, 2025, 11:00 PM</div>
                        <div>Updated: Aug 24, 2025, 11:00 PM</div>
                        <div>Source: seller_connections</div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex items-center gap-3">
                        <button className="flex-1 flex items-center justify-center gap-2 p-3 border border-gray-200 rounded-md hover:bg-gray-50 transition-colors">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                            </svg>
                            <span className="font-medium text-gray-700">Visit</span>
                        </button>

                        <button className="flex-1 flex items-center justify-center gap-2 p-3 border border-gray-200 rounded-md hover:bg-gray-50 transition-colors">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            </svg>
                            <span className="font-medium text-gray-700">Manage</span>
                        </button>

                        <button className="p-3 border border-gray-200 rounded-md hover:bg-red-50 hover:border-red-200 transition-colors">
                            <svg className="w-4 h-4 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                        </button>
                    </div>
                </div>
            </div>


            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="bg-white rounded-md p-6 shadow-sm border border-gray-100">
                    <div className="text-sm text-gray-600 mb-1">Total Stores</div>
                    <div className="text-2xl font-bold text-gray-900">5</div>
                    {/* <div className="text-xs text-gray-500 mt-1">All categories</div> */}
                </div>
                <div className="bg-white rounded-md p-6 shadow-sm border border-gray-100">
                    <div className="text-sm text-gray-600 mb-1">Direct Connections</div>
                    <div className="text-2xl font-bold text-green-600">56
                    </div>

                </div>
                <div className="bg-white rounded-md p-6 shadow-sm border border-gray-100">
                    <div className="text-sm text-gray-600 mb-1">OAuth Connections</div>
                    <div className="text-2xl font-bold text-red-600"> 0

                    </div>
                    {/* <div className="text-xs text-gray-500 mt-1">Need sync</div> */}
                </div>
                <div className="bg-white rounded-md p-6 shadow-sm border border-gray-100">
                    <div className="text-sm text-gray-600 mb-1">Legacy Connections</div>
                    <div className="text-2xl font-bold text-blue-600"> 0 </div>
                    {/* <div className="text-xs text-gray-500 mt-1">For bulk actions</div> */}
                </div>
            </div>

        </div>
    );
};

export default MyStores;