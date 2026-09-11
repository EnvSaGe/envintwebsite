const fs = require('fs');

function inspectCareers() {
  const html = fs.readFileSync('scratch_live_careers.html', 'utf8');
  console.log('=== LIVE CAREERS SECTIONS ===');
  
  // Find "Explore a career" and surrounding text/tags
  const idx = html.indexOf('Explore a career');
  if (idx !== -1) {
    console.log('\n--- Context around "Explore a career" ---');
    console.log(html.slice(idx - 500, idx + 1500));
  }

  // Look for sections or headings across the careers page
  const headings = [...html.matchAll(/<h[1-6][^>]*>(.*?)<\/h[1-6]>/gis)].map(m => m[1].replace(/<[^>]+>/g, '').trim());
  console.log('\nHeadings in live careers:', headings);
}

function inspectEnvision() {
  const html = fs.readFileSync('scratch_live_envision.html', 'utf8');
  console.log('\n=== LIVE ENVISION (BLOGS) CARDS ===');
  
  // Search for elementor-post__excerpt or excerpt
  const excerptMatches = [...html.matchAll(/class="[^"]*elementor-post__excerpt[^"]*"[^>]*>(.*?)<\/div>/gis)];
  console.log('Found elementor-post__excerpt count:', excerptMatches.length);
  if (excerptMatches.length > 0) {
    console.log('First 3 excerpts:');
    excerptMatches.slice(0, 3).forEach((m, i) => {
      console.log(`[${i}]`, m[1].trim());
    });
  }

  // Check CSS for elementor-post__excerpt or clamp
  const cssMatches = [...html.matchAll(/elementor-post__excerpt\s*\{([^}]+)\}/gis)];
  console.log('CSS for excerpt:', cssMatches.map(m => m[1]));
  
  // Also check how many words or lines the excerpt is
  if (excerptMatches.length > 0) {
    const text = excerptMatches[0][1].replace(/<[^>]+>/g, '').trim();
    console.log('Excerpt length (chars):', text.length);
    console.log('Excerpt sample:', text);
  }
}

function inspectJourneyNav() {
  const html = fs.readFileSync('scratch_live_journey.html', 'utf8');
  console.log('\n=== LIVE JOURNEY CSS ===');
  const cssMatch = html.match(/<style[^>]*>([\s\S]*?)<\/style>/i);
  if (cssMatch) {
    console.log(cssMatch[1].slice(0, 3000));
  }
}

inspectCareers();
inspectEnvision();
inspectJourneyNav();
