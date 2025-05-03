document.addEventListener('DOMContentLoaded', () => {
    const apiKeyInput = document.getElementById('api-key');
    const promptInput = document.getElementById('prompt-input');
    const generateBtn = document.getElementById('generate-btn');
    
    // Model-specific elements
    const models = {
        'dalle2': {
            container: document.getElementById('dalle2-container'),
            loading: document.getElementById('dalle2-loading'),
            image: document.getElementById('dalle2-image'),
            error: document.getElementById('dalle2-error')
        },
        'dalle3': {
            container: document.getElementById('dalle3-container'),
            loading: document.getElementById('dalle3-loading'),
            image: document.getElementById('dalle3-image'),
            error: document.getElementById('dalle3-error')
        },
        'gpt4o': {
            container: document.getElementById('gpt4o-container'),
            loading: document.getElementById('gpt4o-loading'),
            image: document.getElementById('gpt4o-image'),
            error: document.getElementById('gpt4o-error')
        }
    };
    
    // Check for API key in local storage
    const savedApiKey = localStorage.getItem('openai_api_key');
    if (savedApiKey) {
        apiKeyInput.value = savedApiKey;
    }
    
    generateBtn.addEventListener('click', async () => {
        const apiKey = apiKeyInput.value.trim();
        const prompt = promptInput.value.trim();
        
        if (!apiKey) {
            alert('Please enter your OpenAI API key');
            return;
        }
        
        if (!prompt) {
            alert('Please enter a prompt for image generation');
            return;
        }
        
        // Save API key to local storage
        localStorage.setItem('openai_api_key', apiKey);
        
        // Disable button during generation
        generateBtn.disabled = true;
        generateBtn.textContent = 'Generating...';
        
        // Reset previous results
        resetAllImages();
        
        // Show loading spinners
        Object.values(models).forEach(model => {
            model.loading.style.display = 'flex';
        });
        
        try {
            // Generate images in parallel
            await Promise.all([
                generateDallE2Image(apiKey, prompt),
                generateDallE3Image(apiKey, prompt),
                generateGPT4oImage(apiKey, prompt)
            ]);
        } catch (error) {
            console.error('Error generating images:', error);
        } finally {
            // Re-enable button
            generateBtn.disabled = false;
            generateBtn.textContent = 'Generate Images';
        }
    });
    
    async function generateDallE2Image(apiKey, prompt) {
        try {
            const response = await fetch('https://api.openai.com/v1/images/generations', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${apiKey}`
                },
                body: JSON.stringify({
                    model: 'dall-e-2',
                    prompt: prompt,
                    n: 1,
                    size: '1024x1024'
                })
            });
            
            const data = await response.json();
            
            if (!response.ok) {
                throw new Error(data.error?.message || 'Failed to generate DALL-E 2 image');
            }
            
            if (data.data && data.data.length > 0) {
                displayImage('dalle2', data.data[0].url);
            } else {
                throw new Error('No image data returned for DALL-E 2');
            }
        } catch (error) {
            displayError('dalle2', error.message);
        } finally {
            models.dalle2.loading.style.display = 'none';
        }
    }
    
    async function generateDallE3Image(apiKey, prompt) {
        try {
            const response = await fetch('https://api.openai.com/v1/images/generations', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${apiKey}`
                },
                body: JSON.stringify({
                    model: 'dall-e-3',
                    prompt: prompt,
                    n: 1,
                    size: '1024x1024',
                    quality: 'standard'
                })
            });
            
            const data = await response.json();
            
            if (!response.ok) {
                throw new Error(data.error?.message || 'Failed to generate DALL-E 3 image');
            }
            
            if (data.data && data.data.length > 0) {
                displayImage('dalle3', data.data[0].url);
            } else {
                throw new Error('No image data returned for DALL-E 3');
            }
        } catch (error) {
            displayError('dalle3', error.message);
        } finally {
            models.dalle3.loading.style.display = 'none';
        }
    }
    
    async function generateGPT4oImage(apiKey, prompt) {
        try {
            // Using the new gpt-image-1 model which is the latest image generation model from OpenAI
            const response = await fetch('https://api.openai.com/v1/images/generations', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${apiKey}`
                },
                body: JSON.stringify({
                    model: 'gpt-image-1', // Using the new gpt-image-1 model
                    prompt: prompt,
                    n: 1,
                    size: '1024x1024'
                })
            });
            
            const data = await response.json();
            
            if (!response.ok) {
                throw new Error(data.error?.message || 'Failed to generate GPT-4o image');
            }
            
            if (data.data && data.data.length > 0) {
                // GPT-Image-1 returns base64 encoded image instead of URL
                if (data.data[0].b64_json) {
                    displayBase64Image('gpt4o', data.data[0].b64_json);
                } else if (data.data[0].url) {
                    displayImage('gpt4o', data.data[0].url);
                } else {
                    throw new Error('No image data returned for GPT-Image-1');
                }
            } else {
                throw new Error('No image data returned for GPT-Image-1');
            }
        } catch (error) {
            displayError('gpt4o', error.message);
        } finally {
            models.gpt4o.loading.style.display = 'none';
        }
    }
    
    function displayImage(modelId, imageUrl) {
        const model = models[modelId];
        model.image.src = imageUrl;
        model.image.style.display = 'block';
        model.error.textContent = '';
    }
    
    function displayBase64Image(modelId, base64Data) {
        const model = models[modelId];
        model.image.src = `data:image/png;base64,${base64Data}`;
        model.image.style.display = 'block';
        model.error.textContent = '';
    }
    
    function displayError(modelId, errorMessage) {
        const model = models[modelId];
        model.error.textContent = `Error: ${errorMessage}`;
        model.image.style.display = 'none';
    }
    
    function resetAllImages() {
        Object.values(models).forEach(model => {
            model.image.style.display = 'none';
            model.image.src = '';
            model.error.textContent = '';
        });
    }
});
