import os
import re
import sys
import time
import base64
from playwright.sync_api import sync_playwright

def parse_prompts(md_path):
    with open(md_path, "r", encoding="utf-8") as f:
        content = f.read()

    recipes = []
    parts = content.split("### ")
    for part in parts[1:]:
        lines = part.strip().split("\n")
        title_line = lines[0]
        num_match = re.match(r"^(\d+)\.", title_line)
        if not num_match:
            continue
        recipe_num = int(num_match.group(1))
        
        file_name = None
        prompt = None
        for i, line in enumerate(lines):
            if "Nombre de archivo sugerido" in line:
                name_match = re.search(r"`([^`]+)`", line)
                if name_match:
                    file_name = name_match.group(1)
            if "Prompt" in line and i + 1 < len(lines):
                prompt_line = lines[i+1].strip()
                prompt_match = re.search(r"`([^`]+)`", prompt_line)
                if prompt_match:
                    prompt = prompt_match.group(1)
                else:
                    prompt = prompt_line.strip("` ")
                    
        if recipe_num and file_name and prompt:
            recipes.append({
                "num": recipe_num,
                "file_name": file_name,
                "prompt": prompt
            })
    return recipes

def download_image_b64(page, src_url, output_path):
    # Resolve full URL if relative
    if src_url.startswith("/"):
        base_url = page.evaluate("window.location.origin")
        full_url = f"{base_url}{src_url}"
    else:
        full_url = src_url

    # Fetch in browser context and return base64
    js_code = """
    async (url) => {
        const response = await fetch(url);
        const blob = await response.blob();
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onloadend = () => resolve(reader.result);
            reader.onerror = reject;
            reader.readAsDataURL(blob);
        });
    }
    """
    data_url = page.evaluate(js_code, full_url)
    header, encoded = data_url.split(",", 1)
    image_data = base64.b64decode(encoded)
    
    with open(output_path, "wb") as f:
        f.write(image_data)

def main():
    sys.stdout.reconfigure(encoding='utf-8')
    md_path = r"r:\ROY\FACULTAD Y TRABAJOS\EMPRENDIMIENTOS\IA\Antigravity Projects\RECETARIO SALUDABLE\prompts-bono5.md"
    output_dir = r"R:\ROY\FACULTAD Y TRABAJOS\EMPRENDIMIENTOS\IA\Antigravity Projects\RECETARIO SALUDABLE\assets\images\imagenes dentro de libros\bono5 - Postres y Snacks - fotos"
    
    os.makedirs(output_dir, exist_ok=True)
    
    recipes = parse_prompts(md_path)
    recipes_to_run = [r for r in recipes if r["num"] >= 1]
    
    print(f"Loaded {len(recipes)} recipes from markdown. Filtered to run {len(recipes_to_run)} recipes (1 to 50).")
    
    with sync_playwright() as p:
        print("Connecting to Chrome over CDP...")
        try:
            browser = p.chromium.connect_over_cdp("http://localhost:9222")
        except Exception as e:
            print(f"Error connecting to Chrome: {e}")
            return
            
        flow_page = None
        for context in browser.contexts:
            for page in context.pages:
                if "labs.google" in page.url and "flow" in page.url:
                    flow_page = page
                    break
        if not flow_page:
            print("Could not find Flow page. Please make sure Google Labs Flow is open.")
            return

        print(f"Connected successfully to tab: '{flow_page.title()}'")
        
        for recipe in recipes_to_run:
            print(f"\n--- Processing Recipe {recipe['num']}: {recipe['file_name']} ---")
            
            # Get current images list
            current_imgs = flow_page.query_selector_all("img[alt='Imagen generada']")
            initial_srcs = {img.get_attribute("src") for img in current_imgs}
            
            # Find input textbox
            textbox = flow_page.query_selector("div[role='textbox']")
            if not textbox:
                print("Error: Input textbox not found on page.")
                continue
                
            # Clear textbox
            textbox.focus()
            flow_page.keyboard.press("Control+A")
            flow_page.keyboard.press("Backspace")
            time.sleep(0.5)
            
            # Type prompt
            print(f"Typing prompt...")
            flow_page.keyboard.type(recipe["prompt"])
            time.sleep(1.0)
            
            # Find Crear button
            buttons = flow_page.query_selector_all("button")
            crear_btn = None
            for btn in buttons:
                text = btn.inner_text().strip() or ""
                if "Crear" in text and "arrow_forward" in text:
                    crear_btn = btn
                    break
            
            if not crear_btn:
                print("Error: 'Crear' button not found on page.")
                continue
                
            # Click Crear
            print("Clicking 'Crear' to generate image...")
            crear_btn.click()
            
            # Wait for generation to complete
            start_time = time.time()
            timeout = 90
            new_img_src = None
            
            while time.time() - start_time < timeout:
                time.sleep(3)
                current_imgs = flow_page.query_selector_all("img[alt='Imagen generada']")
                current_srcs = [img.get_attribute("src") for img in current_imgs]
                new_srcs = [src for src in current_srcs if src not in initial_srcs]
                
                if new_srcs:
                    # Found a new image! Wait a moment to ensure it is fully generated
                    new_img_src = new_srcs[0]
                    print(f"Generation detected! Waiting 5s for final render...")
                    time.sleep(5)
                    break
                else:
                    elapsed = int(time.time() - start_time)
                    print(f"Generating... ({elapsed}s elapsed)")
            
            if not new_img_src:
                print(f"Error: Timeout reached while generating recipe {recipe['num']}.")
                continue
                
            # Download image
            dest_path = os.path.join(output_dir, recipe["file_name"])
            print(f"Downloading image to: {dest_path}")
            try:
                download_image_b64(flow_page, new_img_src, dest_path)
                print(f"Recipe {recipe['num']} completed successfully!")
            except Exception as e:
                print(f"Error downloading image: {e}")
                
            # Pause between generations
            time.sleep(5)

    print("\nAll recipes processed!")

if __name__ == "__main__":
    main()
