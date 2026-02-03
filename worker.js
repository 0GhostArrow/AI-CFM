export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    const method = request.method;
    const path = url.pathname;

    // CORS headers
    const corsHeaders = {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type, Authorization",
    };

    // Handle CORS preflight
    if (method === "OPTIONS") {
      return new Response(null, { headers: corsHeaders });
    }

    // GET / - Serve the web interface (no auth required)
    if (method === "GET" && path === "/") {
      return new Response(getHtml(), {
        headers: { "Content-Type": "text/html", ...corsHeaders },
      });
    }

    // POST /generate - Handle image generation
    if (method === "POST" && path === "/generate") {
      try {
        const contentType = request.headers.get("Content-Type") || "";
        let prompt, model, apiKey;

        if (contentType.includes("application/json")) {
          const body = await request.json();
          prompt = body.prompt;
          model = body.model;
          apiKey = body.api_key;
        } else {
          const formData = await request.formData();
          prompt = formData.get("prompt");
          model = formData.get("model");
          apiKey = formData.get("api_key");
        }

        if (!prompt) {
          return json({ error: "Prompt is required" }, 400, corsHeaders);
        }

        // Validate model
        const validModels = [
          "@cf/stabilityai/stable-diffusion-xl-base-1.0",
          "@cf/blackforestlabs/ux-1-schnell",
          "@cf/bytedance/stable-diffusion-xl-lightning",
          "@cf/lykon/dreamshaper-8-lcm",
          "@cf/runwayml/stable-diffusion-v1-5-img2img",
          "@cf/runwayml/stable-diffusion-v1-5-inpainting",
        ];

        if (!validModels.includes(model)) {
          model = "@cf/stabilityai/stable-diffusion-xl-base-1.0";
        }

        // Check API key (optional for demo)
        const envApiKey = env.API_KEY;
        if (envApiKey && envApiKey.trim() !== "") {
          if (!apiKey || apiKey !== envApiKey) {
            return json(
              { error: "Unauthorized - Invalid or missing API key" },
              401,
              corsHeaders
            );
          }
        }

        // Generate image using Cloudflare Workers AI
        const result = await env.AI.run(model, { prompt });

        return new Response(result, {
          headers: {
            "Content-Type": "image/jpeg",
            "Cache-Control": "no-store, no-cache, must-revalidate",
            ...corsHeaders,
          },
        });
      } catch (err) {
        return json(
          { error: "Failed to generate image", details: err.message },
          500,
          corsHeaders
        );
      }
    }

    // GET /config - Get configuration info
    if (method === "GET" && path === "/config") {
      return json({
        requires_api_key: !!(env.API_KEY && env.API_KEY.trim() !== ""),
        available_models: [
          { id: "@cf/stabilityai/stable-diffusion-xl-base-1.0", name: "Stable Diffusion XL Base 1.0", description: "High quality, default choice" },
          { id: "@cf/blackforestlabs/ux-1-schnell", name: "Black Forest Labs U-XL Schnell", description: "Fast generation" },
          { id: "@cf/bytedance/stable-diffusion-xl-lightning", name: "ByteDance XL Lightning", description: "Very fast, quick prototyping" },
          { id: "@cf/lykon/dreamshaper-8-lcm", name: "DreamShaper 8 LCM", description: "Artistic, creative outputs" },
          { id: "@cf/runwayml/stable-diffusion-v1-5-img2img", name: "Stable Diffusion v1.5 Image-to-Image", description: "Transform existing images" },
          { id: "@cf/runwayml/stable-diffusion-v1-5-inpainting", name: "Stable Diffusion v1.5 Inpainting", description: "Edit specific image areas" },
        ]
      }, 200, corsHeaders);
    }

    return json({ error: "Not found" }, 404, corsHeaders);
  },
};

function json(data, status = 200, headers = {}) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { "Content-Type": "application/json", ...headers },
  });
}

function getHtml() {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>✨ AI Image Generator</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      min-height: 100vh;
      padding: 20px;
    }
    .container { max-width: 800px; margin: 0 auto; }
    header {
      text-align: center;
      color: white;
      padding: 30px 0;
    }
    header h1 { font-size: 2.5rem; margin-bottom: 10px; }
    .card {
      background: white;
      border-radius: 16px;
      padding: 30px;
      box-shadow: 0 10px 40px rgba(0,0,0,0.2);
      margin-bottom: 20px;
    }
    .form-group { margin-bottom: 20px; }
    label {
      display: block;
      margin-bottom: 8px;
      font-weight: 600;
      color: #333;
    }
    textarea {
      width: 100%;
      padding: 15px;
      border: 2px solid #e0e0e0;
      border-radius: 10px;
      font-size: 16px;
      resize: vertical;
      min-height: 100px;
    }
    textarea:focus {
      outline: none;
      border-color: #667eea;
    }
    select {
      width: 100%;
      padding: 12px 15px;
      border: 2px solid #e0e0e0;
      border-radius: 10px;
      font-size: 16px;
      background: white;
    }
    .btn {
      width: 100%;
      padding: 15px 30px;
      border: none;
      border-radius: 10px;
      font-size: 18px;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.3s;
      margin-bottom: 10px;
    }
    .btn-primary {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
    }
    .btn-primary:hover:not(:disabled) {
      transform: translateY(-2px);
      box-shadow: 0 5px 20px rgba(102, 126, 234, 0.4);
    }
    .btn-primary:disabled {
      opacity: 0.6;
      cursor: not-allowed;
    }
    .result-card { display: none; }
    .result-card.visible { display: block; }
    #generatedImage {
      max-width: 100%;
      border-radius: 10px;
      box-shadow: 0 5px 20px rgba(0,0,0,0.1);
    }
    .loading {
      display: none;
      text-align: center;
      padding: 40px;
    }
    .loading.visible { display: block; }
    .spinner {
      width: 50px;
      height: 50px;
      border: 4px solid #f3f3f3;
      border-top: 4px solid #667eea;
      border-radius: 50%;
      animation: spin 1s linear infinite;
      margin: 0 auto 20px;
    }
    @keyframes spin {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }
    .error {
      background: #fee;
      border: 1px solid #fcc;
      color: #c00;
      padding: 15px;
      border-radius: 10px;
      margin-bottom: 20px;
      display: none;
    }
    .error.visible { display: block; }
    .info-box {
      background: #f0f4ff;
      border-left: 4px solid #667eea;
      padding: 15px;
      border-radius: 0 10px 10px 0;
      margin-bottom: 20px;
    }
    .info-box h3 { color: #667eea; margin-bottom: 10px; }
    .info-box ul { margin-left: 20px; color: #555; }
    .info-box li { margin-bottom: 5px; }
    footer {
      text-align: center;
      color: white;
      padding: 20px;
      opacity: 0.8;
    }
    .api-key-section {
      background: #f8f9fa;
      border: 1px solid #e0e0e0;
      border-radius: 10px;
      padding: 20px;
      margin-bottom: 20px;
    }
    .api-key-section h3 {
      margin-bottom: 15px;
      color: #333;
    }
    .api-key-input {
      width: 100%;
      padding: 12px 15px;
      border: 2px solid #e0e0e0;
      border-radius: 10px;
      font-size: 14px;
      font-family: monospace;
    }
    .api-key-saved {
      background: #d4edda;
      border: 1px solid #c3e6cb;
      color: #155724;
      padding: 10px 15px;
      border-radius: 10px;
      margin-top: 10px;
      display: none;
    }
    .api-key-saved.visible { display: block; }
  </style>
</head>
<body>
  <div class="container">
    <header>
      <h1>✨ AI Image Generator</h1>
      <p>Transform your ideas into stunning images with AI</p>
    </header>

    <div class="card">
      <div class="info-box">
        <h3>🎯 How it works</h3>
        <ul>
          <li>Enter a detailed text prompt describing your image</li>
          <li>Choose an AI model (different models have different styles)</li>
          <li>Click "Generate Image" and watch the magic happen!</li>
          <li>100,000 free generations per day</li>
        </ul>
      </div>

      <div class="api-key-section">
        <h3>🔑 API Key (Optional)</h3>
        <p style="color: #666; margin-bottom: 15px;">
          Enter your API key if configured. If no key is required, you can leave this empty.
        </p>
        <input
          type="password"
          id="apiKey"
          class="api-key-input"
          placeholder="Enter API key (if required)"
        />
        <div id="apiKeySaved" class="api-key-saved">
          ✅ API key saved locally in your browser
        </div>
      </div>

      <form id="imageForm">
        <div class="form-group">
          <label for="prompt">📝 Describe your image</label>
          <textarea
            id="prompt"
            name="prompt"
            placeholder="A futuristic city in the clouds with flying cars, cyberpunk style, detailed, 4K..."
            required
          ></textarea>
        </div>

        <div class="form-group">
          <label for="model">🤖 AI Model</label>
          <select id="model" name="model">
            <option value="@cf/stabilityai/stable-diffusion-xl-base-1.0">
              Stable Diffusion XL Base 1.0 (Default - High Quality)
            </option>
            <option value="@cf/blackforestlabs/ux-1-schnell">
              Black Forest Labs U-XL Schnell (Fast)
            </option>
            <option value="@cf/bytedance/stable-diffusion-xl-lightning">
              ByteDance XL Lightning (Very Fast)
            </option>
            <option value="@cf/lykon/dreamshaper-8-lcm">
              DreamShaper 8 LCM (Artistic)
            </option>
            <option value="@cf/runwayml/stable-diffusion-v1-5-img2img">
              Stable Diffusion v1.5 Image-to-Image
            </option>
            <option value="@cf/runwayml/stable-diffusion-v1-5-inpainting">
              Stable Diffusion v1.5 Inpainting
            </option>
          </select>
        </div>

        <button type="submit" class="btn btn-primary" id="generateBtn">
          🚀 Generate Image
        </button>
      </form>

      <div class="error" id="error"></div>

      <div class="loading" id="loading">
        <div class="spinner"></div>
        <p class="loading-text">🎨 Creating your masterpiece...</p>
        <p style="color: #999; font-size: 0.9rem;">This usually takes 5-15 seconds</p>
      </div>

      <div class="result-card" id="resultCard">
        <div class="image-container">
          <img id="generatedImage" alt="Generated Image">
        </div>
        <button class="btn btn-primary" id="downloadBtn">
          💾 Download Image
        </button>
        <button class="btn btn-primary" id="clearBtn">
          🗑️ Clear & Start Over
        </button>
      </div>
    </div>

    <footer>
      <p>Made with ❤️ by 0GhostArrow</p>
      <p style="font-size: 0.8rem; margin-top: 5px;">Free tier: 100,000 generations/day</p>
    </footer>
  </div>

  <script>
    const form = document.getElementById('imageForm');
    const generateBtn = document.getElementById('generateBtn');
    const loading = document.getElementById('loading');
    const resultCard = document.getElementById('resultCard');
    const generatedImage = document.getElementById('generatedImage');
    const errorDiv = document.getElementById('error');
    const downloadBtn = document.getElementById('downloadBtn');
    const clearBtn = document.getElementById('clearBtn');
    const apiKeyInput = document.getElementById('apiKey');
    const apiKeySaved = document.getElementById('apiKeySaved');

    let currentImageBlob = null;

    // Load saved API key
    const savedApiKey = localStorage.getItem('ai_cfm_api_key');
    if (savedApiKey) {
      apiKeyInput.value = savedApiKey;
      apiKeySaved.classList.add('visible');
    }

    // Save API key when changed
    apiKeyInput.addEventListener('change', () => {
      const key = apiKeyInput.value.trim();
      if (key) {
        localStorage.setItem('ai_cfm_api_key', key);
        apiKeySaved.classList.add('visible');
      } else {
        localStorage.removeItem('ai_cfm_api_key');
        apiKeySaved.classList.remove('visible');
      }
    });

    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      
      const prompt = document.getElementById('prompt').value.trim();
      const model = document.getElementById('model').value;
      const apiKey = apiKeyInput.value.trim();

      if (!prompt) {
        showError('Please enter a prompt to generate an image.');
        return;
      }

      resultCard.classList.remove('visible');
      errorDiv.classList.remove('visible');

      loading.classList.add('visible');
      generateBtn.disabled = true;
      generateBtn.textContent = '⏳ Generating...';

      try {
        const response = await fetch('/generate', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            prompt,
            model,
            api_key: apiKey
          }),
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || errorData.details || 'Failed to generate image');
        }

        currentImageBlob = await response.blob();
        const imageUrl = URL.createObjectURL(currentImageBlob);
        
        generatedImage.src = imageUrl;
        generatedImage.style.display = 'block';
        
        loading.classList.remove('visible');
        resultCard.classList.add('visible');
        
      } catch (err) {
        loading.classList.remove('visible');
        showError(err.message || 'An error occurred while generating the image.');
      } finally {
        generateBtn.disabled = false;
        generateBtn.textContent = '🚀 Generate Image';
      }
    });

    function showError(message) {
      errorDiv.textContent = message;
      errorDiv.classList.add('visible');
    }

    downloadBtn.addEventListener('click', () => {
      if (currentImageBlob) {
        const link = document.createElement('a');
        link.href = URL.createObjectURL(currentImageBlob);
        link.download = 'ai-generated-image.jpg';
        link.click();
      }
    });

    clearBtn.addEventListener('click', () => {
      document.getElementById('prompt').value = '';
      document.getElementById('model').value = '@cf/stabilityai/stable-diffusion-xl-base-1.0';
      resultCard.classList.remove('visible');
      errorDiv.classList.remove('visible');
      currentImageBlob = null;
      generatedImage.src = '';
    });
  </script>
</body>
</html>`;
}
