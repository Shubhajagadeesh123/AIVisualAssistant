import easyocr

class OCRService:

    def __init__(self):

        self.reader = easyocr.Reader(
            ['en','kn'],
            gpu=False
        )

    def read(self,image_path):

        result = self.reader.readtext(image_path)

        text=""

        for r in result:

            text += r[1]+"\n"

        return text