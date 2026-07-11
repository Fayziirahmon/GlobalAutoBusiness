const links = [
  "https://i.ibb.co/KcThwv92/image.jpg", "https://i.ibb.co/ynqbrBn8/image.jpg", 
  "https://i.ibb.co/YJJRGzL/image.jpg", "https://i.ibb.co/WpGtGRxt/image.jpg", 
  "https://i.ibb.co/R4C2x61L/image.jpg", "https://i.ibb.co/Tyrgpw7/image.jpg", 
  "https://i.ibb.co/HTGmsgD4/image.jpg", "https://i.ibb.co/BV3JGpmp/image.jpg", 
  "https://i.ibb.co/xt20zgNd/image.jpg", "https://i.ibb.co/TB5khv9P/image.jpg", 
  "https://i.ibb.co/DHK7xm34/image.jpg", "https://i.ibb.co/cXF4WnLP/image.jpg", 
  "https://i.ibb.co/hFMrL2Bg/image.jpg", "https://i.ibb.co/m5t1TCTV/image.jpg", 
  "https://i.ibb.co/jPdjGmM8/image.jpg", "https://i.ibb.co/6R1QhtTf/image.jpg", 
  "https://i.ibb.co/295d1xn/image.jpg", "https://i.ibb.co/7tNFHSbY/image.jpg", 
  "https://i.ibb.co/xKMWhL2Y/image.jpg", "https://i.ibb.co/9HT8Rw6D/image.jpg", 
  "https://i.ibb.co/M535d7PX/image.jpg", "https://i.ibb.co/TBQBgRn9/image.jpg", 
  "https://i.ibb.co/5gPrTnH0/image.jpg", "https://i.ibb.co/hJN4vw6Y/image.jpg", 
  "https://i.ibb.co/r2VDHfGd/image.jpg", "https://i.ibb.co/Mx9jvvtY/image.jpg", 
  "https://i.ibb.co/RkMbtr6b/image.jpg", "https://i.ibb.co/95nLkqm/image.jpg", 
  "https://i.ibb.co/pvs0Dm6k/image.jpg", "https://i.ibb.co/jPSS0gMG/image.jpg", 
  "https://i.ibb.co/8n3ThmXc/image.jpg", "https://i.ibb.co/j9P5CLLZ/image.jpg", 
  "https://i.ibb.co/TM04TKHV/image.jpg", "https://i.ibb.co/PGGvGw3W/image.jpg", 
  "https://i.ibb.co/VcSs8FDG/image.jpg", "https://i.ibb.co/4wcSVhG1/image.jpg", 
  "https://i.ibb.co/FbyxWycb/image.jpg", "https://i.ibb.co/zVMzV9Vy/image.jpg", 
  "https://i.ibb.co/QFp2dVPG/image.jpg", "https://i.ibb.co/W78bgy1/image.jpg", 
  "https://i.ibb.co/LzGh6K20/image.jpg", "https://i.ibb.co/rGQRxJPG/image.jpg", 
  "https://i.ibb.co/WNGsTYDf/image.jpg", "https://i.ibb.co/67RhBvhz/image.jpg", 
  "https://i.ibb.co/9HZ6Yhf1/image.jpg", "https://i.ibb.co/L4m5Sgy/image.jpg", 
  "https://i.ibb.co/PzjYF0ht/image.jpg", "https://i.ibb.co/9khcDk6w/image.jpg", 
  "https://i.ibb.co/k6GgdK27/image.jpg", "https://i.ibb.co/b5YNyybS/image.jpg", 
  "https://i.ibb.co/r2mm6zjz/image.jpg", "https://i.ibb.co/9H09LDhc/image.jpg", 
  "https://i.ibb.co/GfWgkKFz/image.jpg", "https://i.ibb.co/Hf2RpyFT/image.jpg", 
  "https://i.ibb.co/fYf20T1f/image.jpg", "https://i.ibb.co/qMLc11bn/image.jpg", 
  "https://i.ibb.co/xK2cW0kb/image.jpg", "https://i.ibb.co/W4cg6VxS/image.jpg", 
  "https://i.ibb.co/99ZXJss3/image.jpg", "https://i.ibb.co/LXYLVZCf/image.jpg", 
  "https://i.ibb.co/Y4Fyyv2j/image.jpg", "https://i.ibb.co/xqRhTpnt/image.jpg", 
  "https://i.ibb.co/20z3nJ30/image.jpg", "https://i.ibb.co/rRXcmTFr/image.jpg", 
  "https://i.ibb.co/W4H2y4C3/image.jpg", "https://i.ibb.co/RkQsR19q/image.jpg", 
  "https://i.ibb.co/fV9P15Zf/image.jpg", "https://i.ibb.co/yc9XWpk4/image.jpg", 
  "https://i.ibb.co/HT64TMrS/image.jpg", "https://i.ibb.co/fGGssZVw/image.jpg"
];

// Serveringiz manzilini yozing 
const API_URL = 'https://sizning-api-link.onrender.com/api/products'; 

links.forEach((url, index) => {
  fetch(API_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ 
        title: `GlobalAuto Mahsulot ${index + 1}`, 
        description: "Yuqori sifatli ehtiyot qismi", 
        price: 0, 
        imageUrl: url 
    })
  })
  .then(res => res.json())
  .then(data => console.log(`Qo'shildi: ${index + 1}`))
  .catch(err => console.error(`Xatolik ${index + 1}:`, err));
});
links.forEach(url => {
  fetch('https://sizning-api-link.onrender.com/api/products', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ title: "GlobalAuto", description: "Ehtiyot qism", price: 0, imageUrl: url })
  });
});