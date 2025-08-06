export default function createRatingStars(ratingText) {
  const rating = parseFloat(ratingText);
  const percentage = (rating / 5) * 100;

  return `
    <div class="star-rating">
      <div class="star-fill" style="width: ${percentage}%;"></div>
    </div>
  `;
}