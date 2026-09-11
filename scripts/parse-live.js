const fs = require('fs');

function extractCareers() {
  const html = fs.readFileSync('scratch_live_careers.html', 'utf8');
  console.log('=== CAREERS PAGE INSPECTION ===');
  
  // Find headings
  const headings = [...html.matchAll(/<h[1-6][^>]*>(.*?)<\/h[1-6]>/gis)].map(m => m[1].replace(/<[^>]+>/g, '').trim());
  console.log('Headings in live careers:', headings);

  // Search for "Explore a career" or similar
  const matchExplore = html.match(/Explore a career[\s\S]*?(?:<\/section>|<\/div>\s*<\/div>\s*<\/div>)/i);
  if (matchExplore) {
    console.log('\n--- Live "Explore a career" snippet ---');
    console.log(matchExplore[0].slice(0, 1500));
  } else {
    console.log('No "Explore a career" text found in live careers HTML!');
  }

  // Find all text blocks in main content
  const matches = [...html.matchAll(/elementor-widget-container[\s\S]*?<\/div>/gi)];
  console.log('Total elementor containers in careers:', matches.length);
}

function extractEnvision() {
  const html = fs.readFileSync('scratch_live_envision.html', 'utf8');
  console.log('\n=== ENVISION (BLOGS) PAGE INSPECTION ===');
  
  // Let's see how post excerpts are rendered on the live envision page
  // Search for article or card or post
  const posts = [...html.matchAll(/(?:<article|class="[^"]*post[^"]*")[\s\S]*?(?:<\/article>|read-more)/gi)];
  console.log('Found post-like blocks:', posts.length);
  if (posts.length > 0) {
    console.log('Sample post from live:', posts[0][0].slice(0, 800));
  } else {
    // Search for blog titles on live
    const blogMatch = html.match(/India's New Labour Codes[\s\S]*?(?:Read More|read-more|<\/article>)/i);
    if (blogMatch) {
      console.log('Sample blog text on live:', blogMatch[0].slice(0, 1000));
    } else {
      console.log('Search for "India" in live envision');
      const idx = html.indexOf("Labour");
      if (idx !== -1) {
        console.log(html.slice(idx - 200, idx + 600));
      }
    }
  }
}

function extractJourney() {
  const html = fs.readFileSync('scratch_live_journey.html', 'utf8');
  console.log('\n=== JOURNEY SECTION INSPECTION ===');
  console.log(html.slice(0, 1500));
}

extractCareers();
extractEnvision();
extractJourney();
