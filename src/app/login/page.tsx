import LoginForm from "@/components/login/login";

export default function LoginPage() {
  return (
    <div className="min-h-screen flex">
      {/* ───────── LEFT PANEL ───────── */}
      <div className="hidden lg:flex lg:w-[48%] relative bg-[#0d9488] overflow-hidden flex-col justify-between p-10 xl:p-14">
        <div
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage: `repeating-linear-gradient(
              -45deg,
              transparent,
              transparent 12px,
              rgba(255,255,255,0.08) 12px,
              rgba(255,255,255,0.08) 13px
            )`,
          }}
        />

        <div className="relative z-10">
          <div className="flex items-center gap-2 mb-8">
            <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
              <div className="w-4 h-4 rounded-full bg-white" />
            </div>
          </div>

          <h1 className="text-3xl xl:text-4xl font-bold text-white leading-tight max-w-md">
            Smart College Management System
          </h1>
          <p className="mt-4 text-teal-100 text-sm xl:text-base max-w-sm leading-relaxed">
            Manage students, faculty, courses, attendance and results — all in
            one powerful platform
          </p>
        </div>

        {/* Dashboard mock + floating badges (same design) */}
        <div className="relative z-10 flex-1 flex items-center justify-center my-8">
          <div className="relative w-full max-w-md">
            <div className="bg-white rounded-xl shadow-2xl p-4 transform -rotate-1">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-5 h-5 rounded bg-blue-500 flex items-center justify-center text-[10px] text-white font-bold">
                  in
                </div>
                <span className="text-xs font-semibold text-gray-700">
                  Campaign Performance
                </span>
              </div>

              <div className="flex items-end gap-1.5 h-28 mb-3">
                {[40, 65, 45, 80, 55, 70, 90, 50, 75, 60].map((h, i) => (
                  <div
                    key={i}
                    className="flex-1 rounded-t bg-gradient-to-t from-teal-400 to-teal-200"
                    style={{ height: `${h}%` }}
                  />
                ))}
              </div>

              <div className="space-y-1.5 text-[11px]">
                <div className="flex justify-between">
                  <span className="text-gray-500">Open Rate</span>
                  <span className="font-medium text-gray-800">45%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Click-Through Rate</span>
                  <span className="font-medium text-gray-800">83%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Conversion Rate</span>
                  <span className="font-medium text-gray-800">68%</span>
                </div>
              </div>
            </div>

            <span className="absolute -top-3 left-6 bg-white text-[11px] font-medium px-2.5 py-1 rounded-full shadow-md flex items-center gap-1">
              <span className="w-3 h-3 rounded-sm bg-blue-500" /> Calendar
            </span>
            <span className="absolute top-8 -right-4 bg-white text-[11px] font-medium px-2.5 py-1 rounded-full shadow-md flex items-center gap-1">
              <span className="w-3 h-3 rounded bg-[#611f69]" /> Slack
            </span>
            <span className="absolute bottom-16 -left-6 bg-white text-[11px] font-medium px-2.5 py-1 rounded-full shadow-md flex items-center gap-1">
              <span className="w-3 h-3 rounded bg-green-600" /> Shopify
            </span>
            <span className="absolute bottom-8 left-10 bg-white text-[11px] font-medium px-2.5 py-1 rounded-full shadow-md flex items-center gap-1">
              <span className="w-3 h-3 rounded bg-[#03363d]" /> Zendesk
            </span>
            <span className="absolute bottom-20 right-0 bg-white text-[11px] font-medium px-2.5 py-1 rounded-full shadow-md flex items-center gap-1">
              <span className="w-3 h-3 rounded bg-blue-600" /> Google Ads
            </span>
            <span className="absolute -bottom-2 right-8 bg-cyan-400 text-white text-[11px] font-medium px-2.5 py-1 rounded-full shadow-md">
              Robin hood
            </span>
          </div>
        </div>

     
      </div>

      {/* ───────── RIGHT PANEL ───────── */}
      <div className="flex-1 flex flex-col items-center justify-center bg-[#f8fafc] px-4 py-10 relative">
        <div
          className="absolute inset-0 opacity-[0.4] pointer-events-none"
          style={{
            backgroundImage: `
              linear-gradient(to right, #e2e8f0 1px, transparent 1px),
              linear-gradient(to bottom, #e2e8f0 1px, transparent 1px)
            `,
            backgroundSize: "80px 80px",
          }}
        />

        <div className="relative z-10 w-full max-w-[420px]">
          <LoginForm />
        </div>

        
      </div>
    </div>
  );
}