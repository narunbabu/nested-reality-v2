import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'
import { ApiResponse } from '@/types';

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const supabase = await createClient()
    const { id } = await params

    // Check authentication
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      return NextResponse.json<ApiResponse>({
        success: false,
        error: 'Authentication required'
      }, { status: 401 })
    }

    // Check if user is admin
    const { data: userData } = await supabase
      .from('users')
      .select('role')
      .eq('id', user.id)
      .single()

    if (!userData || userData.role !== 'admin') {
      return NextResponse.json<ApiResponse>({
        success: false,
        error: 'Admin access required'
      }, { status: 403 })
    }

    const { action, moderation_notes } = await request.json()

    if (action !== 'approve' && action !== 'reject') {
      return NextResponse.json<ApiResponse>({
        success: false,
        error: 'Invalid action'
      }, { status: 400 })
    }

    // Update review
    const { data: review, error } = await supabase
      .from('reviews')
      .update({
        moderation_status: action === 'approve' ? 'approved' : 'rejected',
        is_approved: action === 'approve',
        moderation_notes: moderation_notes || null,
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .select('*, user:users(email, full_name)')
      .single()

    if (error) {
      return NextResponse.json<ApiResponse>({
        success: false,
        error: error.message
      }, { status: 400 })
    }

    // TODO: Send email notification to user about moderation decision
    // This would integrate with an email service in Phase 1

    return NextResponse.json<ApiResponse>({
      success: true,
      data: review,
      message: `Review ${action === 'approve' ? 'approved' : 'rejected'} successfully`
    })

  } catch (error) {
    console.error('Moderate review error:', error)
    return NextResponse.json<ApiResponse>({
      success: false,
      error: 'Internal server error'
    }, { status: 500 })
  }
}
