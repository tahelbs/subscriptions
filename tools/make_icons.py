"""יוצר את אייקוני האפליקציה (קבצי PNG) בלי תוכנות נוספות.

האייקון: ריבוע בכחול כהה, ובמרכזו קבלה לבנה עם שלושה קווים.
מריצים פעם אחת מתיקיית הפרויקט:  python3 tools/make_icons.py
הקבצים נשמרים בתיקייה icons.
"""
import struct
import zlib
from pathlib import Path

NAVY = (31, 58, 95)      # הצבע של האפליקציה (#1f3a5f)
WHITE = (255, 255, 255)

# הגדלים שצריך: אנדרואיד ומחשב (192, 512), אייפון (180), ואייקון קטן ללשונית בדפדפן (32)
SIZES = {
    'icon-192.png': 192,
    'icon-512.png': 512,
    'apple-touch-icon.png': 180,
    'favicon-32.png': 32,
}


def color_at(x, y):
    """הצבע בנקודה (x, y), כששני הערכים בין 0 ל-1."""
    # הקבלה: מלבן במרכז. הקצה התחתון שלה משונן (זיגזג), כמו קבלה שנתלשה
    left, right, top = 0.31, 0.69, 0.22
    tooth = 0.0475                         # רוחב של שן אחת בזיגזג
    phase = ((x - left) / tooth) % 1.0
    zigzag = abs(phase - 0.5) * 2          # בין 0 ל-1
    bottom = 0.76 + 0.035 * zigzag

    if left <= x <= right and top <= y <= bottom:
        # שלושה קווים בכחול על הקבלה
        lines = [(0.34, 0.62), (0.45, 0.62), (0.56, 0.52)]
        for line_y, line_end in lines:
            if line_y <= y <= line_y + 0.04 and 0.38 <= x <= line_end:
                return NAVY
        return WHITE
    return NAVY


def render(size, samples=3):
    """מצייר את האייקון בגודל מסוים. כל פיקסל מחושב מכמה נקודות, כדי שהקצוות יהיו חלקים."""
    rows = []
    for py in range(size):
        row = bytearray([0])  # בתחילת כל שורה ב-PNG יש בית של "סוג סינון" (0 = בלי)
        for px in range(size):
            r = g = b = 0
            for sy in range(samples):
                for sx in range(samples):
                    x = (px + (sx + 0.5) / samples) / size
                    y = (py + (sy + 0.5) / samples) / size
                    cr, cg, cb = color_at(x, y)
                    r, g, b = r + cr, g + cg, b + cb
            n = samples * samples
            row += bytes((r // n, g // n, b // n))
        rows.append(bytes(row))
    return b''.join(rows)


def write_png(path, size, pixels):
    """שומר את הפיקסלים כקובץ PNG (צבעי RGB, בלי שקיפות)."""
    def chunk(kind, data):
        body = kind + data
        return struct.pack('>I', len(data)) + body + struct.pack('>I', zlib.crc32(body))

    header = struct.pack('>IIBBBBB', size, size, 8, 2, 0, 0, 0)
    png = b'\x89PNG\r\n\x1a\n' + chunk(b'IHDR', header) + chunk(b'IDAT', zlib.compress(pixels, 9)) + chunk(b'IEND', b'')
    path.write_bytes(png)


if __name__ == '__main__':
    folder = Path(__file__).resolve().parent.parent / 'icons'
    folder.mkdir(exist_ok=True)
    for name, size in SIZES.items():
        write_png(folder / name, size, render(size))
        print(f'נוצר {name} ({size}x{size})')
