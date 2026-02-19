const GITHUB_USERNAME = 'vamsivalluri-19';
const MAX_PROJECTS = 6;
const LIVE_URL_OVERRIDES = {
  'Satellite-Crop-Health': 'https://satellite-crop-health.onrender.com/'
};

const body = document.body;
const themeToggle = document.getElementById('theme-toggle');
const mobileBtn = document.getElementById('mobile-menu');
const navLinks = document.getElementById('nav-links');
const form = document.getElementById('contact-form');
const projectsContainer = document.getElementById('github-projects');
const projectsStatus = document.getElementById('projects-status');
const profileForm = document.getElementById('profile-form');
const profileStatus = document.getElementById('profile-status');
const profileImageInput = document.getElementById('profile-image');
const profilePreview = document.getElementById('profile-preview');
const editProfileBtn = document.getElementById('edit-profile');
const saveProfileBtn = document.getElementById('save-profile');
const resetProfileBtn = document.getElementById('reset-profile');
const removeImageBtn = document.getElementById('remove-image');
const linkedInLink = document.getElementById('linkedin-link');

const PROFILE_STORAGE_KEY = 'portfolioProfileData';
const DEFAULT_PROFILE_IMAGE = 'https://avatars.githubusercontent.com/u/191577980?v=4';

function setThemeButtonText() {
  if (!themeToggle) return;
  themeToggle.textContent = body.classList.contains('dark-mode') ? 'Light' : 'Dark';
}

const savedTheme = localStorage.getItem('theme');
if (savedTheme === 'dark') {
  body.classList.add('dark-mode');
}
setThemeButtonText();

if (themeToggle) {
  themeToggle.addEventListener('click', () => {
    body.classList.toggle('dark-mode');
    const isDark = body.classList.contains('dark-mode');
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
    setThemeButtonText();
  });
}

if (mobileBtn && navLinks) {
  mobileBtn.addEventListener('click', () => {
    const isOpen = navLinks.classList.toggle('show');
    mobileBtn.setAttribute('aria-expanded', String(isOpen));
  });
}

document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
  anchor.addEventListener('click', (event) => {
    const id = anchor.getAttribute('href');
    if (!id) return;
    const target = document.querySelector(id);
    if (target) {
      event.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      navLinks?.classList.remove('show');
      mobileBtn?.setAttribute('aria-expanded', 'false');
    }
  });
});

if (form) {
  form.addEventListener('submit', (event) => {
    event.preventDefault();
    const name = document.getElementById('name')?.value.trim();
    const email = document.getElementById('email')?.value.trim();
    const message = document.getElementById('message')?.value.trim();

    if (!name || !email || !message) return;

    let feedback = form.querySelector('.form-message');
    if (!feedback) {
      feedback = document.createElement('p');
      feedback.className = 'form-message';
      feedback.setAttribute('role', 'status');
      form.appendChild(feedback);
    }

    feedback.textContent = 'Thank you for your message. I will get back to you soon.';
    form.reset();
  });
}

const profileFields = [
  document.getElementById('profile-name'),
  document.getElementById('profile-role'),
  document.getElementById('profile-location'),
  document.getElementById('profile-email'),
  document.getElementById('profile-linkedin'),
  document.getElementById('profile-bio')
].filter(Boolean);

function setProfileEditable(isEditable) {
  profileFields.forEach((field) => {
    field.disabled = !isEditable;
  });

  if (saveProfileBtn) {
    saveProfileBtn.disabled = !isEditable;
  }

  if (editProfileBtn) {
    editProfileBtn.textContent = isEditable ? 'Editing...' : 'Edit Profile';
    editProfileBtn.disabled = isEditable;
  }
}

function getProfileValues() {
  return {
    name: document.getElementById('profile-name')?.value.trim() || '',
    role: document.getElementById('profile-role')?.value.trim() || '',
    location: document.getElementById('profile-location')?.value.trim() || '',
    email: document.getElementById('profile-email')?.value.trim() || '',
    linkedin: document.getElementById('profile-linkedin')?.value.trim() || 'https://www.linkedin.com',
    bio: document.getElementById('profile-bio')?.value.trim() || '',
    image: profilePreview?.getAttribute('src') || DEFAULT_PROFILE_IMAGE
  };
}

function setProfileValues(values) {
  const nameField = document.getElementById('profile-name');
  const roleField = document.getElementById('profile-role');
  const locationField = document.getElementById('profile-location');
  const emailField = document.getElementById('profile-email');
  const linkedinField = document.getElementById('profile-linkedin');
  const bioField = document.getElementById('profile-bio');

  if (nameField) nameField.value = values.name || '';
  if (roleField) roleField.value = values.role || '';
  if (locationField) locationField.value = values.location || '';
  if (emailField) emailField.value = values.email || '';
  if (linkedinField) linkedinField.value = values.linkedin || 'https://www.linkedin.com';
  if (bioField) bioField.value = values.bio || '';
  if (profilePreview) profilePreview.src = values.image || DEFAULT_PROFILE_IMAGE;

  if (linkedInLink) {
    linkedInLink.href = values.linkedin || 'https://www.linkedin.com';
  }
}

function loadSavedProfile() {
  if (!profileForm) return;

  const raw = localStorage.getItem(PROFILE_STORAGE_KEY);
  if (!raw) {
    setProfileEditable(false);
    return;
  }

  try {
    const data = JSON.parse(raw);
    setProfileValues(data);
  } catch {
    localStorage.removeItem(PROFILE_STORAGE_KEY);
  }

  setProfileEditable(false);
}

if (editProfileBtn) {
  editProfileBtn.addEventListener('click', () => {
    setProfileEditable(true);
    if (profileStatus) {
      profileStatus.textContent = 'Edit mode enabled. Update details and click Save Details.';
    }
  });
}

if (profileImageInput && profilePreview) {
  profileImageInput.addEventListener('change', (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      profilePreview.src = String(reader.result || DEFAULT_PROFILE_IMAGE);
      if (profileStatus) {
        profileStatus.textContent = 'Image selected. Click Save Details to keep this image.';
      }
    };
    reader.readAsDataURL(file);
  });
}

if (removeImageBtn && profilePreview) {
  removeImageBtn.addEventListener('click', () => {
    profilePreview.src = DEFAULT_PROFILE_IMAGE;
    if (profileImageInput) {
      profileImageInput.value = '';
    }
    if (profileStatus) {
      profileStatus.textContent = 'Profile image reset to default. Save to keep changes.';
    }
  });
}

if (profileForm) {
  profileForm.addEventListener('submit', (event) => {
    event.preventDefault();

    const values = getProfileValues();
    if (!values.name || !values.role || !values.email) {
      if (profileStatus) {
        profileStatus.textContent = 'Please fill Name, Role, and Email before saving.';
      }
      return;
    }

    localStorage.setItem(PROFILE_STORAGE_KEY, JSON.stringify(values));
    setProfileEditable(false);
    if (profileStatus) {
      profileStatus.textContent = 'Profile updated successfully.';
    }
  });
}

if (resetProfileBtn) {
  resetProfileBtn.addEventListener('click', () => {
    localStorage.removeItem(PROFILE_STORAGE_KEY);
    setProfileValues({
      name: 'Vamsi Valluri',
      role: 'Software Engineer',
      location: 'Guntur, India',
      email: 'vamsivalluri533@gmail.com',
      linkedin: 'https://www.linkedin.com',
      bio: 'I am passionate about building clean, useful, and production-ready web applications. I focus on user experience, reliable backend integration, and practical problem solving.',
      image: DEFAULT_PROFILE_IMAGE
    });

    if (profileImageInput) {
      profileImageInput.value = '';
    }

    setProfileEditable(false);
    if (profileStatus) {
      profileStatus.textContent = 'Profile reset to default values.';
    }
  });
}

function formatDate(dateString) {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short' });
}

function renderProjects(repositories) {
  if (!projectsContainer) return;

  if (!repositories.length) {
    projectsContainer.innerHTML = `
      <article class="card">
        <div class="card-body">
          <h3>No public repositories found</h3>
          <p>Projects will appear here after repositories are published on GitHub.</p>
        </div>
      </article>
    `;
    return;
  }

  projectsContainer.innerHTML = repositories.map((repo) => {
    const description = repo.description || 'No description provided yet.';
    const language = repo.language || 'N/A';
    const updated = formatDate(repo.updated_at);
    const liveUrl = LIVE_URL_OVERRIDES[repo.name] || (repo.homepage && repo.homepage.trim() ? repo.homepage : '');
    const liveLink = liveUrl ? `<a class="btn btn-small" href="${liveUrl}" target="_blank" rel="noopener">Live</a>` : '';

    return `
      <article class="card">
        <div class="card-body">
          <h3>${repo.name}</h3>
          <p>${description}</p>
          <div class="project-meta">
            <span>${language}</span>
            <span>Updated ${updated}</span>
          </div>
          <div class="card-actions">
            ${liveLink}
            <a class="btn btn-outline btn-small" href="${repo.html_url}" target="_blank" rel="noopener">Code</a>
          </div>
        </div>
      </article>
    `;
  }).join('');
}

async function loadGitHubProjects() {
  if (!projectsContainer) return;

  try {
    const response = await fetch(`https://api.github.com/users/${GITHUB_USERNAME}/repos?sort=updated&per_page=20`);
    if (!response.ok) {
      throw new Error(`GitHub API error: ${response.status}`);
    }

    const repositories = await response.json();
    const filtered = repositories
      .filter((repo) => !repo.fork)
      .slice(0, MAX_PROJECTS);

    renderProjects(filtered);
    if (projectsStatus) {
      projectsStatus.textContent = `Showing ${filtered.length} latest projects from GitHub.`;
    }
  } catch {
    projectsContainer.innerHTML = `
      <article class="card">
        <div class="card-body">
          <h3>Unable to load projects right now</h3>
          <p>Please check your network connection or GitHub API availability.</p>
        </div>
      </article>
    `;
    if (projectsStatus) {
      projectsStatus.textContent = 'Project sync failed. Please try again later.';
    }
  }
}

const yearSpan = document.getElementById('year');
if (yearSpan) {
  yearSpan.textContent = String(new Date().getFullYear());
}

loadSavedProfile();
loadGitHubProjects();
