import html
import re
import sys
import urllib.request
import uuid

BASE = "http://localhost:3000"


def hidden_action_fields(page_html):
    """Return the ordered (name, value) pairs React renders for its server action."""
    pairs = []
    for m in re.finditer(r'<input[^>]*type="hidden"[^>]*>', page_html):
        tag = m.group(0)
        name = re.search(r'name="([^"]*)"', tag)
        value = re.search(r'value="([^"]*)"', tag)
        if name and name.group(1).startswith("$ACTION"):
            pairs.append((html.unescape(name.group(1)), html.unescape(value.group(1)) if value else ""))
    return pairs


def submit(path, fields):
    req = urllib.request.Request(BASE + path, headers={"User-Agent": "sportika-verify"})
    page = urllib.request.urlopen(req).read().decode()
    pairs = hidden_action_fields(page)
    if not pairs:
        print(f"!! no server-action fields found on {path}")
        return
    data = pairs + list(fields.items())
    boundary = "----sportika" + uuid.uuid4().hex
    body = b""
    for name, value in data:
        body += f'--{boundary}\r\nContent-Disposition: form-data; name="{name}"\r\n\r\n{value}\r\n'.encode()
    body += f"--{boundary}--\r\n".encode()
    req = urllib.request.Request(
        BASE + path,
        data=body,
        headers={
            "Content-Type": f"multipart/form-data; boundary={boundary}",
            "User-Agent": "sportika-verify",
        },
        method="POST",
    )
    try:
        res = urllib.request.urlopen(req)
        text = res.read().decode(errors="replace")
        print(f"{path}: HTTP {res.status}; any-result={('ok' in text) or ('Received' in text)}")
    except urllib.error.HTTPError as e:
        print(f"{path}: HTTP {e.code} {e.read().decode(errors='replace')[:300]}")


if __name__ == "__main__":
    submit(
        "/contact",
        {
            "name": "Verification Bot",
            "email": "verify+contact@example.com",
            "phone": "03001234567",
            "topic": "general",
            "message": "Automated verification of the public contact form after the web_* migration.",
            "company_website": "",
        },
    )
