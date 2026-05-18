from PIL import Image

def main():
    b1 = Image.open('assets/images/bono1-planificador.png').convert("RGBA")
    b2 = Image.open('assets/images/bono2-jugos-detox.png').convert("RGBA")
    b3 = Image.open('assets/images/bono3-sin-tacc.png').convert("RGBA")
    b4 = Image.open('assets/images/bono4-sin-harinas.png').convert("RGBA")
    b5 = Image.open('assets/images/bono5-postres.png').convert("RGBA")
    main_bk = Image.open('assets/images/ebook-cover.png').convert("RGBA")

    # Resize bonuses
    base_h = 300
    def rescale(img, h):
        w_percent = (h / float(img.size[1]))
        w_size = int((float(img.size[0]) * float(w_percent)))
        return img.resize((w_size, h), Image.Resampling.LANCZOS)
    
    b1 = rescale(b1, base_h)
    b2 = rescale(b2, base_h)
    b3 = rescale(b3, base_h)
    b4 = rescale(b4, base_h)
    b5 = rescale(b5, base_h)
    main_bk = rescale(main_bk, 450) # Larger

    canvas_w = 900
    canvas_h = 600
    canvas = Image.new("RGBA", (canvas_w, canvas_h), (0, 0, 0, 0))

    # Center-back (Bono 3)
    b3_rot = b3.rotate(0, expand=True)
    canvas.paste(b3_rot, (320, 20), b3_rot) 

    # Left far back (Bono 1)
    b1_rot = b1.rotate(18, expand=True)
    canvas.paste(b1_rot, (50, 50), b1_rot)

    # Right far back (Bono 5)
    b5_rot = b5.rotate(-18, expand=True)
    canvas.paste(b5_rot, (550, 50), b5_rot)

    # Left mid (Bono 2)
    b2_rot = b2.rotate(10, expand=True)
    canvas.paste(b2_rot, (150, 100), b2_rot)

    # Right mid (Bono 4)
    b4_rot = b4.rotate(-10, expand=True)
    canvas.paste(b4_rot, (450, 100), b4_rot)

    # Center-front (Main Ebook)
    main_bk_rot = main_bk.rotate(0, expand=True)
    canvas.paste(main_bk_rot, (260, 80), main_bk_rot)

    canvas.save('assets/images/bonos-bundle.png')

if __name__ == '__main__':
    main()
