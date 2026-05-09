## 2025-05-09 - Client and Server-side File Upload Validation Bypass
**Vulnerability:** Arbitrary file upload vulnerability in `RecipeForm.tsx`. The file input element was missing extension validation before submitting the image to Supabase storage.
**Learning:** React component validation should strictly complement backend or API-side validation. Upload flows in Next.js/Supabase architectures can often bypass traditional API endpoint checks if uploads happen directly from the client.
**Prevention:** Ensure explicit whitelist validation of file extensions and MIME types is performed immediately before the `supabase.storage.from(...).upload(...)` call, not just implicitly in the UI components (`accept="image/*"`).
