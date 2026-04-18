import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Shell } from '@/components/layout/Shell';
import Home from '@/pages/Home';
import ForYou from '@/pages/ForYou';
import AroundYou from '@/pages/AroundYou';
import PostDetail from '@/pages/PostDetail';
import UserProfile from '@/pages/UserProfile';
import People from '@/pages/People';
import NotFound from '@/pages/NotFound';

export default function App() {
  return (
    <BrowserRouter>
      <Shell>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/for-you" element={<ForYou />} />
          <Route path="/around-you" element={<AroundYou />} />
          <Route path="/posts/:id" element={<PostDetail />} />
          <Route path="/users/:id" element={<UserProfile />} />
          <Route path="/people" element={<People />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Shell>
    </BrowserRouter>
  );
}
