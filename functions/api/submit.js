export async function onRequestPost(context) {
  const { request, env } = context;

  try {
    const data = await request.json();
    
    // 1. Basic Server-side Validation
    if (!data.email || !data.name) {
      return new Response(JSON.stringify({ error: "Missing required fields" }), { status: 400 });
    }

    // 2. Check if email already exists in D1
    // Assumes your D1 binding name is 'MY_DB' (configure this in dashboard later)
    const existingUser = await env.MY_DB.prepare(
      "SELECT email FROM registrations WHERE email = ?"
    ).bind(data.email).first();

    if (existingUser) {
      return new Response(JSON.stringify({ error: "Email already registered" }), { status: 409 });
    }

    // 3. Insert new user
    const result = await env.MY_DB.prepare(
      "INSERT INTO registrations (name, dob, email, qualification, pincode, state, percent_cgpa) VALUES (?, ?, ?, ?, ?, ?, ?)"
    ).bind(
      data.name, 
      data.dob, 
      data.email, 
      data.qualification, 
      data.pincode, 
      data.state, 
      data.percent_cgpa
    ).run();

    if (result.success) {
      return new Response(JSON.stringify({ success: true }), { status: 200 });
    } else {
      throw new Error("Database insertion failed");
    }

  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), { status: 500 });
  }
}