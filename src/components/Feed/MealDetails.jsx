"use client";
export default function MealDetails({ initialMeals }) {
  const IsRangeTooHigh = (range) => {
    if (!range || range === "N/A") return true;
    return parseInt(range.split(":")[1].trim()) > 500;
  };
  return (
    <div className="meal-details">
      {initialMeals.map((meal) => (
        <div className="recipe-item" key={meal.id}>
          <div className="card">
            <img src={meal.image} alt="Recipe" className="recipe-image" />
            <div className="recipe-text">
              <div className="title">{meal.ingredients}</div>
              <p className="description">{meal.description}</p>
              <p className="number-range">
                Calory range: {meal.range}
                {!IsRangeTooHigh(meal.range) && (
                  <img src="happy-face.png" alt="" />
                )}
              </p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
