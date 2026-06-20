"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase";
import { AvatarCropper } from "@/components/ui/avatar-cropper";
import { Button } from "@/components/ui/button";
import { accountTypeLabel } from "@/components/ui/role-badge";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "@/components/ui/toast";
import { REGISTRATION_STEPS } from "@/lib/constants";
import { cn, formatDate, formatHeight } from "@/lib/utils";
import type { Profile } from "@/types";

export default function Dashboard() {
  const router = useRouter();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const avatarRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLInputElement>(null);
  const photosRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState<"avatar" | "video" | null>(null);
  const [cropFile, setCropFile] = useState<File | null>(null);
  const [deletingVideo, setDeletingVideo] = useState(false);
  const [photoBusy, setPhotoBusy] = useState(false);

  const MAX_PHOTOS = 5;

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(async ({ data }) => {
      if (!data.user) {
        router.replace("/login?next=/dashboard");
        return;
      }
      const { data: prof } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", data.user.id)
        .single();
      setProfile(prof as Profile);
      setLoading(false);
    });
  }, [router]);

  async function uploadCroppedAvatar(blob: Blob) {
    setUploading("avatar");
    const supabase = createClient();
    const { data: userData } = await supabase.auth.getUser();
    if (!userData.user || !profile) return;

    const path = `${userData.user.id}/${Date.now()}-avatar.jpg`;
    const { error } = await supabase.storage
      .from("avatars")
      .upload(path, blob, { contentType: "image/jpeg" });
    if (error) {
      toast("Upload failed: " + error.message, "error");
      setUploading(null);
      return;
    }
    const url = supabase.storage.from("avatars").getPublicUrl(path).data.publicUrl;
    await supabase
      .from("profiles")
      .update({ avatar_url: url })
      .eq("id", userData.user.id);
    setProfile({ ...profile, avatar_url: url });
    setCropFile(null);
    setUploading(null);
    toast("Photo updated.");
  }

  async function deleteVideo() {
    if (!profile?.video_url) return;
    if (!confirm("Delete your introduction video? Visitors will no longer see it on your profile.")) return;
    setDeletingVideo(true);
    const supabase = createClient();
    const { data: userData } = await supabase.auth.getUser();
    if (!userData.user) return;

    // video_url is a public URL; older rows may hold a raw storage path
    const url = profile.video_url;
    const marker = "/videos/";
    const path = url.startsWith("http")
      ? decodeURIComponent(url.slice(url.indexOf(marker) + marker.length))
      : url;
    const { error: storageError } = await supabase.storage
      .from("videos")
      .remove([path]);
    if (storageError) {
      toast("Could not delete the video file: " + storageError.message, "error");
      setDeletingVideo(false);
      return;
    }
    const { error } = await supabase
      .from("profiles")
      .update({ video_url: null })
      .eq("id", userData.user.id);
    setDeletingVideo(false);
    if (error) {
      toast(error.message, "error");
      return;
    }
    setProfile({ ...profile, video_url: null });
    toast("Introduction video deleted.");
  }

  async function uploadMedia(kind: "avatar" | "video", file: File) {
    if (kind === "video" && file.size > 50 * 1024 * 1024) {
      toast("Video must be 50MB or smaller.", "error");
      return;
    }
    setUploading(kind);
    const supabase = createClient();
    const { data: userData } = await supabase.auth.getUser();
    if (!userData.user || !profile) return;

    const bucket = kind === "avatar" ? "avatars" : "videos";
    const path = `${userData.user.id}/${Date.now()}-${file.name}`;
    const { error } = await supabase.storage.from(bucket).upload(path, file);
    if (error) {
      toast("Upload failed: " + error.message, "error");
      setUploading(null);
      return;
    }

    const url = supabase.storage.from(bucket).getPublicUrl(path).data.publicUrl;
    const column = kind === "avatar" ? "avatar_url" : "video_url";
    await supabase
      .from("profiles")
      .update({ [column]: url })
      .eq("id", userData.user.id);

    setProfile({ ...profile, [column]: url });
    toast(kind === "avatar" ? "Photo updated." : "Video intro uploaded.");
    setUploading(null);
  }

  async function addPhotos(files: FileList) {
    if (!profile) return;
    const current = profile.photos ?? [];
    const remaining = MAX_PHOTOS - current.length;
    if (remaining <= 0) {
      toast(`You can upload up to ${MAX_PHOTOS} photos.`, "error");
      return;
    }
    const picked = Array.from(files).slice(0, remaining);
    setPhotoBusy(true);
    const supabase = createClient();
    const { data: userData } = await supabase.auth.getUser();
    if (!userData.user) {
      setPhotoBusy(false);
      return;
    }

    const uploaded: string[] = [];
    for (const file of picked) {
      if (!file.type.startsWith("image/")) continue;
      const path = `${userData.user.id}/gallery-${Date.now()}-${file.name}`;
      const { error } = await supabase.storage
        .from("avatars")
        .upload(path, file);
      if (error) {
        toast("Upload failed: " + error.message, "error");
        continue;
      }
      uploaded.push(
        supabase.storage.from("avatars").getPublicUrl(path).data.publicUrl
      );
    }

    if (uploaded.length > 0) {
      const next = [...current, ...uploaded].slice(0, MAX_PHOTOS);
      await supabase
        .from("profiles")
        .update({ photos: next })
        .eq("id", userData.user.id);
      setProfile({ ...profile, photos: next });
      toast(`${uploaded.length} photo(s) added.`);
    }
    setPhotoBusy(false);
  }

  async function removePhoto(url: string) {
    if (!profile) return;
    setPhotoBusy(true);
    const supabase = createClient();
    const { data: userData } = await supabase.auth.getUser();
    if (!userData.user) {
      setPhotoBusy(false);
      return;
    }
    // Best effort: also drop the file from storage.
    const marker = "/avatars/";
    if (url.includes(marker)) {
      const path = decodeURIComponent(url.slice(url.indexOf(marker) + marker.length));
      await supabase.storage.from("avatars").remove([path]);
    }
    const next = (profile.photos ?? []).filter((p) => p !== url);
    await supabase
      .from("profiles")
      .update({ photos: next })
      .eq("id", userData.user.id);
    setProfile({ ...profile, photos: next });
    setPhotoBusy(false);
    toast("Photo removed.");
  }

  if (loading || !profile) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-12">
        <Skeleton className="h-40 w-full rounded-2xl" />
        <Skeleton className="mt-6 h-64 w-full rounded-2xl" />
      </div>
    );
  }

  const step = profile.registration_step ?? 1;
  const totalSteps = REGISTRATION_STEPS.length;
  const incomplete = step < totalSteps;
  const nextStep = REGISTRATION_STEPS[Math.min(step, totalSteps - 1)];

  return (
    <div className="bg-off-white py-10">
      {cropFile && (
        <AvatarCropper
          file={cropFile}
          onCancel={() => setCropFile(null)}
          onSave={uploadCroppedAvatar}
          saving={uploading === "avatar"}
        />
      )}
      <div className="mx-auto max-w-4xl px-4">
        {/* Header card */}
        <div className="rounded-2xl bg-white p-6 shadow-sm sm:p-8">
          <div className="flex flex-wrap items-center gap-5">
            <button
              onClick={() => avatarRef.current?.click()}
              className="group relative cursor-pointer"
              title="Change photo"
            >
              {profile.avatar_url ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={profile.avatar_url}
                  alt="Your avatar"
                  className="h-24 w-24 rounded-full object-cover"
                />
              ) : (
                <div className="flex h-24 w-24 items-center justify-center rounded-full bg-coral/15 text-4xl">
                  {profile.gender === "Female" ? "🌸" : "🌙"}
                </div>
              )}
              <span className="absolute inset-0 flex items-center justify-center rounded-full bg-black/40 text-xs font-bold text-white opacity-0 transition-opacity group-hover:opacity-100">
                {uploading === "avatar" ? "..." : "Change"}
              </span>
            </button>
            <input
              ref={avatarRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => {
                const f = e.target.files?.[0];
                if (f) setCropFile(f);
                e.target.value = ""; // allow picking the same file again
              }}
            />

            <div className="flex-1">
              <h1 className="text-2xl font-bold text-charcoal">
                {profile.user_id_handle ?? "Member"}
              </h1>
              <p className="text-sm text-charcoal/60">
                Profile No. {profile.internal_id} · Registered{" "}
                {formatDate(profile.registration_date)}
              </p>
              <div className="mt-2 flex flex-wrap items-center gap-2">
                <span
                  className={cn(
                    "inline-block rounded-full px-3 py-1 text-xs font-bold",
                    profile.status === "Verified"
                      ? "bg-green-100 text-green-700"
                      : "bg-amber-100 text-amber-700"
                  )}
                >
                  {profile.status}
                </span>
                <span
                  className={cn(
                    "inline-block rounded-full px-3 py-1 text-xs font-bold",
                    profile.role === "admin"
                      ? "bg-amber-100 text-amber-700"
                      : "bg-gray-100 text-gray-600"
                  )}
                >
                  Account Type: {accountTypeLabel(profile.role)}
                </span>
              </div>
            </div>

            {profile.status !== "Verified" && (
              <Link href="/payment">
                <Button>Get Verified</Button>
              </Link>
            )}
          </div>
        </div>

        {/* Incomplete registration nudge */}
        {incomplete && nextStep && (
          <div className="mt-6 flex flex-wrap items-center justify-between gap-4 rounded-2xl border-2 border-dashed border-coral/40 bg-coral/5 p-6">
            <div>
              <h2 className="font-bold text-charcoal">
                Your profile is incomplete ({step}/{totalSteps} steps done)
              </h2>
              <p className="mt-1 text-sm text-charcoal/60">
                Complete profiles get far more responses. Next:{" "}
                {nextStep.label}
              </p>
            </div>
            <Link href={nextStep.path}>
              <Button variant="outline">Continue Registration</Button>
            </Link>
          </div>
        )}

        {/* Quick actions */}
        <div className="mt-6 grid gap-6 sm:grid-cols-3">
          <ActionCard
            href="/search"
            icon="🔍"
            title="Search Profiles"
            text="Find compatible matches using your preferences"
          />
          <ActionCard
            href="/register/personal"
            icon="✏️"
            title="Edit Profile"
            text="Update your personal and family details"
          />
          <ActionCard
            href="/payment"
            icon="💳"
            title="Payments"
            text="View payment history and verification status"
          />
        </div>

        {/* Profile summary */}
        <div className="mt-6 grid gap-6 sm:grid-cols-2">
          <div className="rounded-2xl bg-white p-6 shadow-sm">
            <h2 className="mb-4 text-lg font-bold text-charcoal">At a Glance</h2>
            <dl className="space-y-2 text-sm">
              <SummaryRow label="Age" value={profile.age?.toString()} />
              <SummaryRow
                label="Height"
                value={formatHeight(profile.height_ft, profile.height_in, profile.height_cm)}
              />
              <SummaryRow label="Marital Status" value={profile.marital_status} />
              <SummaryRow label="Religion" value={profile.religion} />
              <SummaryRow label="Sect" value={profile.sect} />
              <SummaryRow label="Caste" value={profile.caste} />
              <SummaryRow
                label="Country"
                value={profile.residence_country?.join(", ")}
              />
            </dl>
          </div>

          <div className="rounded-2xl bg-white p-6 shadow-sm">
            <h2 className="mb-4 text-lg font-bold text-charcoal">
              Video Introduction
            </h2>
            <p className="text-sm text-charcoal/60">
              Upload a short MP4 intro (max 50MB). It appears on your public
              profile for everyone who views it.
            </p>
            {profile.video_url && (
              <video
                src={profile.video_url}
                controls
                preload="metadata"
                className="mt-4 w-full rounded-xl bg-black"
              />
            )}
            <input
              ref={videoRef}
              type="file"
              accept="video/mp4"
              className="hidden"
              onChange={(e) => {
                const f = e.target.files?.[0];
                if (f) uploadMedia("video", f);
              }}
            />
            <div className="mt-4 flex flex-wrap gap-3">
              <Button
                variant="outline"
                onClick={() => videoRef.current?.click()}
                loading={uploading === "video"}
              >
                {profile.video_url ? "Replace Video" : "Upload Video"}
              </Button>
              {profile.video_url && (
                <Button
                  variant="ghost"
                  className="text-red-500 hover:text-red-600"
                  onClick={deleteVideo}
                  loading={deletingVideo}
                >
                  Delete Video
                </Button>
              )}
            </div>
            {profile.video_url && (
              <p className="mt-2 text-xs font-semibold text-green-600">
                ✓ Video intro live on your profile
              </p>
            )}
          </div>
        </div>

        {/* Photo gallery */}
        <div className="mt-6 rounded-2xl bg-white p-6 shadow-sm">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h2 className="text-lg font-bold text-charcoal">Your Photos</h2>
              <p className="text-sm text-charcoal/60">
                Upload up to {MAX_PHOTOS} photos. They appear on your profile for
                other members.
              </p>
            </div>
            <span className="text-sm font-semibold text-charcoal/50">
              {(profile.photos ?? []).length}/{MAX_PHOTOS}
            </span>
          </div>

          <input
            ref={photosRef}
            type="file"
            accept="image/*"
            multiple
            className="hidden"
            onChange={(e) => {
              if (e.target.files?.length) addPhotos(e.target.files);
              e.target.value = "";
            }}
          />

          <div className="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-5">
            {(profile.photos ?? []).map((url) => (
              <div
                key={url}
                className="group relative aspect-square overflow-hidden rounded-xl bg-off-white"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={url}
                  alt="Profile photo"
                  className="h-full w-full object-cover"
                />
                <button
                  type="button"
                  onClick={() => removePhoto(url)}
                  disabled={photoBusy}
                  className="absolute right-1.5 top-1.5 cursor-pointer rounded-full bg-black/55 px-2 py-0.5 text-xs font-bold text-white opacity-0 transition-opacity group-hover:opacity-100 disabled:opacity-50"
                  title="Remove photo"
                >
                  ✕
                </button>
              </div>
            ))}

            {(profile.photos ?? []).length < MAX_PHOTOS && (
              <button
                type="button"
                onClick={() => photosRef.current?.click()}
                disabled={photoBusy}
                className="flex aspect-square cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-coral/40 bg-coral/5 text-coral transition-colors hover:bg-coral/10 disabled:opacity-50"
              >
                <span className="text-3xl leading-none">＋</span>
                <span className="mt-1 text-xs font-bold">
                  {photoBusy ? "Uploading..." : "Add Photo"}
                </span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function ActionCard({
  href,
  icon,
  title,
  text,
}: {
  href: string;
  icon: string;
  title: string;
  text: string;
}) {
  return (
    <Link
      href={href}
      className="rounded-2xl bg-white p-6 shadow-sm transition-shadow hover:shadow-md"
    >
      <div className="text-3xl">{icon}</div>
      <h3 className="mt-3 font-bold text-charcoal">{title}</h3>
      <p className="mt-1 text-sm text-charcoal/60">{text}</p>
    </Link>
  );
}

function SummaryRow({
  label,
  value,
}: {
  label: string;
  value: string | null | undefined;
}) {
  return (
    <div className="flex justify-between gap-3">
      <dt className="text-charcoal/50">{label}</dt>
      <dd className="text-right font-semibold text-charcoal">
        {value || "Not set"}
      </dd>
    </div>
  );
}
