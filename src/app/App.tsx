const APP_TITLE = 'ReleaseHub';
const APP_SUBTITLE = 'GitLab 릴리즈 정보를 하나의 원본 데이터로 관리합니다';

export const App = () => {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center px-6">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">{APP_TITLE}</h1>
        <p className="text-lg text-gray-600">{APP_SUBTITLE}</p>
      </div>
    </div>
  );
};
