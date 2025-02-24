export async function POST(req) {
    try {
        // Authenticate user
        const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
        if (!token) {
            console.error('❌ [401] Unauthorized request - No valid token found.');
            return NextResponse.json({ 
                error: 'Unauthorized access. Please log in.', 
                code: 401 
            }, { status: 401 });
        }

        // Parse request body
        let body;
        try {
            body = await req.json();
        } catch (parseError) {
            console.error('❌ [400] Invalid JSON format:', parseError);
            return NextResponse.json({ 
                error: 'Invalid request format. Ensure JSON body is properly formatted.', 
                code: 4001
            }, { status: 400 });
        }

        const { site_id, mode_id, account_id, proxy_id, product, monitor_delay, error_delay, taskAmount } = body;

        // Validate required fields
        if (!site_id || !mode_id || !product) {
            console.warn('⚠️ [422] Missing required fields:', { site_id, mode_id, product });
            return NextResponse.json({ 
                error: 'Missing required fields. Ensure site, mode, and product are provided.', 
                code: 4221 
            }, { status: 422 });
        }

        // Ensure taskAmount is valid
        const validTaskAmount = parseInt(taskAmount, 10);
        if (isNaN(validTaskAmount) || validTaskAmount < 1) {
            console.warn('⚠️ [422] Invalid task amount:', taskAmount);
            return NextResponse.json({ 
                error: 'Invalid task amount. Must be a number greater than 0.', 
                code: 4222 
            }, { status: 422 });
        }

        // Default values
        const finalMonitorDelay = monitor_delay || 3500;
        const finalErrorDelay = error_delay || 3500;

        // Insert multiple tasks
        const taskIds = [];
        for (let i = 0; i < validTaskAmount; i++) {
            const taskId = uuidv4();
            taskIds.push(taskId);

            try {
                await queryDatabase(
                    `INSERT INTO tasks (id, user_id, account_id, proxy_id, site_id, product, mode_id, monitor_delay, error_delay, status, created_at)
                     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 'pending', NOW())`,
                    [taskId, token.sub, account_id || null, proxy_id || null, site_id, product, mode_id, finalMonitorDelay, finalErrorDelay]
                );
            } catch (dbError) {
                console.error(`❌ [500] Database error while inserting task ${taskId}:`, dbError);
                return NextResponse.json({ 
                    error: 'Database error. Task creation failed.', 
                    code: 5001 
                }, { status: 500 });
            }
        }

        console.log(`✅ [201] Successfully created ${validTaskAmount} task(s) for user ${token.sub}`);
        return NextResponse.json({
            message: `${validTaskAmount} task(s) created successfully.`,
            taskIds,
            code: 201
        }, { status: 201 });

    } catch (error) {
        console.error('❌ [500] Unexpected server error:', error);
        return NextResponse.json({ 
            error: 'Unexpected server error. Please try again later.', 
            code: 5002 
        }, { status: 500 });
    }
}
