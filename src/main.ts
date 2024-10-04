import './style.css'

const header = document.querySelector<HTMLHeadingElement>('#header')!;
const content = document.querySelector<HTMLDivElement>('#content')!;
const navigateButton = document.querySelector<HTMLButtonElement>('#navigate')!;
const userName = document.querySelector<HTMLParagraphElement>('#username')!;
const searchParams = new URLSearchParams(window.location.search);

navigateButton.style.viewTransitionName = 'navigateButton';
content.style.viewTransitionName = 'content';
userName.style.viewTransitionName = 'userName';

const updateUserName = () => {
  userName.textContent = searchParams.get('name') || 'No name found';
};

const switchUsernamePosition = (navigatingTo: 'about' | 'home') => {
  if (navigatingTo === 'home') {
    header.appendChild(userName);
  } else {
    content.appendChild(userName);
  }
}

navigateButton.addEventListener('click', () => {
  if (window.location.pathname === '/about') {
    window.history.pushState({}, '', `/?${searchParams}`);
  } else {
    window.history.pushState({}, '', `/about?${searchParams}`);
  }
  window.dispatchEvent(new PopStateEvent('popstate'));
});

const renderContent = () => {
  content.innerHTML = '';
  
  const pathName = window.location.pathname;
  switchUsernamePosition(pathName === '/' ? 'home' : 'about');
  updateUserName();

  if (pathName === '/') {
    navigateButton.textContent = 'Navigate to /about';
    const input = document.createElement('input');

    input.type = 'text';
    input.placeholder = 'Enter your name';
    input.value = searchParams.get('name') || '';
    content.appendChild(input);

    input.addEventListener('input', () => {
      if (!input.value) {
        userName.textContent = 'No name found';
        window.history.replaceState({}, '', `${window.location.pathname}`);
        return;
      }

      userName.textContent = input.value;
      searchParams.set('name', input.value);
      window.history.replaceState({}, '', `${window.location.pathname}?${searchParams}`);
    });

    input.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        window.location.search = searchParams.toString();
      }
    });
    
  } else if (pathName === '/about') {
    navigateButton.textContent = 'Navigate to /';
    const about = document.createElement('p');
    about.textContent = 'This is the about page';
    content.appendChild(about);
  }
};

const renderWithViewTransition = () => document.startViewTransition(renderContent);

renderWithViewTransition();

window.addEventListener('popstate', renderWithViewTransition);