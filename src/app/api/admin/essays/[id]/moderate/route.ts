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

    const { action } = await request.json()

    if (action !== 'approve' && action !== 'reject' && action !== 'unpublish') {
      return NextResponse.json<ApiResponse>({
        success: false,
        error: 'Invalid action'
      }, { status: 400 })
    }

    // Update essay
    const updateData: any = {
      updated_at: new Date().toISOString()
    }

    if (action === 'approve') {
      updateData.is_approved = true
      updateData.is_published = true
    } else if (action === 'reject') {
      updateData.is_approved = false
      updateData.is_published = false
    } else if (action === 'unpublish') {
      updateData.is_published = false
    }

    const { data: essay, error } = await supabase
      .from('essays')
      .update(updateData)
      .eq('id', id)
      .select('*, user:users(email, full_name)')
      .single()

    if (error) {
      return NextResponse.json<ApiResponse>({
        success: false,
        error: error.message
      }, { status: 400 })
    }

    return NextResponse.json<ApiResponse>({
      success: true,
      data: essay,
      message: `Essay ${action === 'approve' ? 'approved' : action === 'reject' ? 'rejected' : 'unpublished'} successfully`
    })

  } catch (error) {
    console.error('Moderate essay error:', error)
    return NextResponse.json<ApiResponse>({
      success: false,
      error: 'Internal server error'
    }, { status: 500 })
  }
}
