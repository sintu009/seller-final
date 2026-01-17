// Test script to verify order approval endpoints
const testOrderApproval = async () => {
  const baseUrl = process.env.CLIENT_URL;

  try {
    // Test 1: Check if orders endpoint is accessible
    console.log("Testing orders endpoint...");
    const ordersResponse = await fetch(`${baseUrl}/orders/admin`, {
      credentials: "include",
    });
    console.log("Orders endpoint status:", ordersResponse.status);

    if (ordersResponse.ok) {
      const ordersData = await ordersResponse.json();
      console.log("Orders data:", ordersData);

      if (ordersData.data && ordersData.data.length > 0) {
        const testOrder = ordersData.data[0];
        console.log("Test order:", testOrder);

        // Test 2: Try to approve an order
        console.log("Testing order approval...");
        const approveResponse = await fetch(
          `${baseUrl}/orders/${testOrder._id}/approve`,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
            },
            credentials: "include",
            body: JSON.stringify({
              notes: "Test approval from API test",
            }),
          }
        );

        console.log("Approve response status:", approveResponse.status);
        const approveData = await approveResponse.json();
        console.log("Approve response:", approveData);
      }
    }
  } catch (error) {
    console.error("Test error:", error);
  }
};

// Run test
testOrderApproval();
