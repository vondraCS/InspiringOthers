import { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, MapPin } from 'lucide-react';
import { useUserStore } from '@/store/userStore';

export default function UserProfile() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const user = useUserStore((s) => (id ? s.usersById[id] : undefined));
  const loading = useUserStore((s) => (id ? s.loadingById[id] : false));
  const error = useUserStore((s) => (id ? s.errorById[id] : null));
  const loadUser = useUserStore((s) => s.loadUser);

  useEffect(() => {
    if (id) loadUser(id);
  }, [id, loadUser]);

  if (!id) {
    return <div className="px-[45px] pt-[55px] font-inter text-base">Missing user id.</div>;
  }

  return (
    <div className="px-[45px] pt-[55px] pb-10 flex flex-col gap-6 max-w-4xl">
      <button
        type="button"
        onClick={() => navigate(-1)}
        className="flex items-center gap-1 font-inter text-sm text-black/70 hover:text-black w-fit cursor-pointer"
      >
        <ArrowLeft size={16} strokeWidth={2} />
        Back
      </button>

      {loading && !user ? (
        <p className="font-inter text-base text-black">Loading...</p>
      ) : error && !user ? (
        <p className="font-inter text-base text-black">Could not load this user.</p>
      ) : !user ? (
        <p className="font-inter text-base text-black">User not found.</p>
      ) : (
        <>
          <header className="flex items-center gap-5">
            <img
              src={user.avatar}
              alt={user.name}
              className="w-24 h-24 rounded-full object-cover bg-[#d5d5d5] shrink-0"
            />
            <div className="flex flex-col gap-1">
              <h1 className="font-raleway font-bold text-3xl text-black">{user.name}</h1>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="font-inter text-xs text-black/80 border border-black/20 rounded-full px-2 py-0.5 capitalize">
                  {user.skillLevel}
                </span>
                <span className="flex items-center gap-1 font-inter text-sm text-black/70">
                  <MapPin size={14} strokeWidth={1.5} />
                  {user.location}
                </span>
              </div>
            </div>
          </header>

          <section className="flex flex-col gap-2">
            <h2 className="font-raleway font-bold text-xl text-black">Interests</h2>
            {user.interests.length === 0 ? (
              <p className="font-inter text-sm text-black/70">No interests listed.</p>
            ) : (
              <div className="flex flex-wrap gap-2">
                {user.interests.map((interest) => (
                  <span
                    key={interest}
                    className="font-inter text-sm text-black/80 border border-black/20 rounded-full px-3 py-1"
                  >
                    {interest}
                  </span>
                ))}
              </div>
            )}
          </section>

          <section className="flex flex-col gap-2">
            <h2 className="font-raleway font-bold text-xl text-black">Goals</h2>
            {user.goals.length === 0 ? (
              <p className="font-inter text-sm text-black/70">No goals listed.</p>
            ) : (
              <ul className="flex flex-col gap-1.5">
                {user.goals.map((goal) => (
                  <li
                    key={goal}
                    className="font-inter text-base text-black/80 pl-4 border-l-2 border-[#2ECB71]"
                  >
                    {goal}
                  </li>
                ))}
              </ul>
            )}
          </section>
        </>
      )}
    </div>
  );
}
