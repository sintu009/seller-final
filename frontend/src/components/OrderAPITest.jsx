import React, { useState } from 'react';
import { useGetAdminOrdersQuery, useApproveOrderMutation, useRejectOrderMutation } from '../../store/slices/apiSlice';

const OrderAPITest = () => {
  const [testResults, setTestResults] = useState([]);
  
  const { data: ordersData, error: ordersError } = useGetAdminOrdersQuery();
  const [approveOrder] = useApproveOrderMutation();
  const [rejectOrder] = useRejectOrderMutation();

  const addTestResult = (test, result, error = null) => {
    setTestResults(prev => [...prev, { test, result, error, timestamp: new Date().toISOString() }]);
  };

  const testGetOrders = () => {
    if (ordersError) {
      addTestResult('Get Orders', 'FAILED', ordersError);
    } else if (ordersData) {
      addTestResult('Get Orders', 'SUCCESS', `Found ${ordersData.data?.length || 0} orders`);
    } else {
      addTestResult('Get Orders', 'LOADING', 'Still loading...');
    }
  };

  const testApproveOrder = async () => {
    if (!ordersData?.data?.length) {
      addTestResult('Approve Order', 'FAILED', 'No orders available to test');
      return;
    }

    const testOrder = ordersData.data.find(o => o.status === 'admin_review');
    if (!testOrder) {
      addTestResult('Approve Order', 'FAILED', 'No orders in admin_review status');
      return;
    }

    try {
      const result = await approveOrder({
        orderId: testOrder._id,
        notes: 'API Test Approval'
      }).unwrap();
      addTestResult('Approve Order', 'SUCCESS', `Order ${testOrder.orderNumber} approved`);
    } catch (error) {
      addTestResult('Approve Order', 'FAILED', error.data?.message || error.message);
    }
  };

  const testRejectOrder = async () => {
    if (!ordersData?.data?.length) {
      addTestResult('Reject Order', 'FAILED', 'No orders available to test');
      return;
    }

    const testOrder = ordersData.data.find(o => o.status === 'admin_review');
    if (!testOrder) {
      addTestResult('Reject Order', 'FAILED', 'No orders in admin_review status');
      return;
    }

    try {
      const result = await rejectOrder({
        orderId: testOrder._id,
        notes: 'API Test Rejection'
      }).unwrap();
      addTestResult('Reject Order', 'SUCCESS', `Order ${testOrder.orderNumber} rejected`);
    } catch (error) {
      addTestResult('Reject Order', 'FAILED', error.data?.message || error.message);
    }
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-xl font-bold mb-4">Order API Test Panel</h2>
      
      <div className="space-y-4 mb-6">
        <button 
          onClick={testGetOrders}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Test Get Orders
        </button>
        
        <button 
          onClick={testApproveOrder}
          className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
        >
          Test Approve Order
        </button>
        
        <button 
          onClick={testRejectOrder}
          className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
        >
          Test Reject Order
        </button>
      </div>

      <div className="space-y-2">
        <h3 className="font-semibold">Test Results:</h3>
        {testResults.map((result, index) => (
          <div key={index} className={`p-2 rounded text-sm ${
            result.result === 'SUCCESS' ? 'bg-green-100 text-green-800' :
            result.result === 'FAILED' ? 'bg-red-100 text-red-800' :
            'bg-yellow-100 text-yellow-800'
          }`}>
            <strong>{result.test}:</strong> {result.result}
            {result.error && <div className="text-xs mt-1">{JSON.stringify(result.error)}</div>}
          </div>
        ))}
      </div>

      <div className="mt-6">
        <h3 className="font-semibold mb-2">Current Orders Data:</h3>
        <pre className="text-xs bg-gray-100 p-2 rounded overflow-auto max-h-40">
          {JSON.stringify(ordersData, null, 2)}
        </pre>
      </div>
    </div>
  );
};

export default OrderAPITest;