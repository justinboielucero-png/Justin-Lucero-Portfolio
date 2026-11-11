from pathlib import Path
from io import BytesIO
from zipfile import ZipFile
from hashlib import sha256

carrier = Path("/tmp/pc-build-transfer.jpg").read_bytes()
marker = b"\nJUSTIN-PC-BUILD-ARCHIVE-2026\n"
assert carrier.count(marker) == 1, "Cannot locate the expected image archive"
expected = {
    "pc-build-rgb-tower.jpg": "861ebbe550748adc68865e4a94b5c50f293031bc555ca4bdf4ee164918dc1ea2",
    "pc-build-black-tower.jpg": "29f404aaa7f85339551871231e5bd6a0c75ca2501e895a20db968b071123cd6d",
    "pc-build-rtx-interior.jpg": "a31285503512a836475e4c8487f9d5df5a486d15b55bcba4aac2c5492961b980",
}
directory = Path("assets/portfolio")
directory.mkdir(parents=True, exist_ok=True)
with ZipFile(BytesIO(carrier.split(marker, 1)[1])) as archive:
    assert set(archive.namelist()) == set(expected)
    for name, digest in expected.items():
        content = archive.read(name)
        assert content.startswith(bytes([255, 216]))
        assert sha256(content).hexdigest() == digest, name + " failed integrity check"
        (directory / name).write_bytes(content)
        print("verified", name, len(content))
