export function getInitials(name) {
    const words = name.split(' ');
    let initials = '';
    words.forEach(word => {
      initials += word.charAt(0);
    });
    return initials.toUpperCase();
  }