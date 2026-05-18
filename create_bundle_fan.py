"""
Genera una ÚNICA imagen PNG con los 5 bonos en abanico.
Los libros se separan bien horizontalmente para que cada tapa sea visible.
"""
from PIL import Image, ImageFilter

def rescale(img, h):
    ratio = h / img.size[1]
    return img.resize((int(img.size[0] * ratio), h), Image.Resampling.LANCZOS)

def main():
    books = [
        Image.open('assets/images/bono1-planificador.png').convert("RGBA"),
        Image.open('assets/images/bono2-jugos-detox.png').convert("RGBA"),
        Image.open('assets/images/bono3-sin-tacc.png').convert("RGBA"),
        Image.open('assets/images/bono4-sin-harinas.png').convert("RGBA"),
        Image.open('assets/images/bono5-postres.png').convert("RGBA"),
    ]
    
    # Smaller books, more spread
    book_h = 280
    books = [rescale(b, book_h) for b in books]
    book_w = books[0].size[0]
    
    # Wide canvas so books don't overlap too much
    spacing = int(book_w * 0.72)  # ~72% of book width = ~28% overlap
    total_w = spacing * 4 + book_w + 80  # 5 books + margins
    canvas_h = 420
    canvas = Image.new("RGBA", (total_w, canvas_h), (0, 0, 0, 0))
    
    # Fan config: (index, angle, y_nudge)
    # Outer books: more rotation, slightly lower
    # Center book: no rotation, higher (in front)
    fan = [
        (0,  10,  30),   # far left
        (1,   5,  15),   # mid left
        (2,   0,   0),   # center (front)
        (3,  -5,  15),   # mid right
        (4, -10,  30),   # far right
    ]
    
    # Paint order: outermost first (back), center last (front)
    paint_order = [0, 4, 1, 3, 2]
    
    for idx in paint_order:
        book_idx, angle, y_nudge = fan[idx]
        book = books[book_idx]
        
        # Add shadow
        shadow = Image.new("RGBA", book.size, (0, 0, 0, 0))
        alpha = book.split()[3]
        shadow_layer = Image.new("RGBA", book.size, (0, 0, 0, 90))
        shadow_layer.putalpha(alpha)
        shadow_layer = shadow_layer.filter(ImageFilter.GaussianBlur(10))
        
        pad = 30
        with_shadow = Image.new("RGBA", (book.size[0] + pad*2, book.size[1] + pad*2), (0, 0, 0, 0))
        with_shadow.paste(shadow_layer, (pad + 5, pad + 8), shadow_layer)
        with_shadow.paste(book, (pad, pad), book)
        
        # Rotate
        if angle != 0:
            rotated = with_shadow.rotate(angle, expand=True, resample=Image.Resampling.BICUBIC)
        else:
            rotated = with_shadow
        
        # X position: evenly spaced
        x = 40 + idx * spacing + (book_w - rotated.size[0]) // 2
        # Y position: center vertically with nudge
        y = (canvas_h - rotated.size[1]) // 2 + y_nudge
        
        canvas.paste(rotated, (x, y), rotated)
    
    # Crop to content
    bbox = canvas.getbbox()
    if bbox:
        canvas = canvas.crop(bbox)
    
    canvas.save('assets/images/bonos-bundle.png', optimize=True)
    print(f"Saved bonos-bundle.png ({canvas.size[0]}x{canvas.size[1]})")

if __name__ == '__main__':
    main()
