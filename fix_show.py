with open('src/main.js', 'r', encoding='utf-8') as f:
    js = f.read()

old = """    renderReviewsProfile(reviews);
  } catch (err) {
    console.error('Error loading profile:', err);
}
}"""

new = """    renderReviewsProfile(reviews);
    document.getElementById('dialog-view-profile').showModal();
  } catch (err) {
    console.error('Error loading profile:', err);
  }
}"""

if old in js:
    js = js.replace(old, new)
    with open('src/main.js', 'w', encoding='utf-8') as f:
        f.write(js)
    print("FIXED - showModal added back")
else:
    print("EXACT MATCH NOT FOUND - trying alternate")
    # try with different whitespace
    import re
    pattern = r'renderReviewsProfile\(reviews\);\s*\}\s*catch\s*\(err\)\s*\{\s*console\.error\(\'Error loading profile:\',\s*err\);\s*\}\s*\}'
    match = re.search(pattern, js)
    if match:
        js = js[:match.start()] + """    renderReviewsProfile(reviews);
    document.getElementById('dialog-view-profile').showModal();
  } catch (err) {
    console.error('Error loading profile:', err);
  }
}""" + js[match.end():]
        with open('src/main.js', 'w', encoding='utf-8') as f:
            f.write(js)
        print("FIXED via regex")
    else:
        print("COULD NOT FIND")
