// =============================================================================
// HaruKorean - Profile Update API Route
// =============================================================================

import { getAuthUser } from "@/lib/auth";
import { getDB } from "@/lib/db";

export async function PUT(request: Request) {
  try {
    const user = await getAuthUser(request);
    if (!user) {
      return Response.json(
        { success: false, error: "로그인이 필요합니다." },
        { status: 401 },
      );
    }

    const body = await request.json();
    const { displayName, grade, semester } = body as {
      displayName?: string;
      grade?: number;
      semester?: number;
    };

    // Build dynamic update
    const updates: string[] = [];
    const values: unknown[] = [];

    if (displayName !== undefined) {
      const name = displayName.trim();
      if (name.length < 2 || name.length > 20) {
        return Response.json(
          { success: false, error: "닉네임은 2~20자여야 합니다." },
          { status: 400 },
        );
      }
      updates.push("display_name = ?");
      values.push(name);
    }

    if (grade !== undefined) {
      if (grade < 1 || grade > 6) {
        return Response.json(
          { success: false, error: "학년은 1~6 사이여야 합니다." },
          { status: 400 },
        );
      }
      updates.push("grade = ?");
      values.push(grade);
    }

    if (semester !== undefined) {
      if (semester !== 1 && semester !== 2) {
        return Response.json(
          { success: false, error: "학기는 1 또는 2여야 합니다." },
          { status: 400 },
        );
      }
      updates.push("semester = ?");
      values.push(semester);
    }

    if (updates.length === 0) {
      return Response.json(
        { success: false, error: "변경할 항목이 없습니다." },
        { status: 400 },
      );
    }

    updates.push("updated_at = ?");
    values.push(new Date().toISOString());
    values.push(user.uid);

    const db = await getDB();
    await db
      .prepare(`UPDATE users SET ${updates.join(", ")} WHERE id = ?`)
      .bind(...values)
      .run();

    // Return updated user
    const updatedRow = await db
      .prepare("SELECT * FROM users WHERE id = ?")
      .bind(user.uid)
      .first<Record<string, unknown>>();

    if (!updatedRow) {
      return Response.json(
        { success: false, error: "사용자를 찾을 수 없습니다." },
        { status: 404 },
      );
    }

    const { rowToUserProfile } = await import("@/lib/auth");
    const updatedUser = rowToUserProfile(updatedRow);

    return Response.json({ success: true, user: updatedUser });
  } catch (error) {
    console.error("프로필 업데이트 오류:", error);
    return Response.json(
      { success: false, error: "프로필 업데이트에 실패했습니다." },
      { status: 500 },
    );
  }
}
