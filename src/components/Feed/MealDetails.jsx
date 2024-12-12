"use client";
export default function MealDetails({ initialMeals }) {
  return (
    <div className="meal-details">
      {initialMeals.map((meal) => (
        <div className="recipe-item" key={meal.id}>
          <div className="card">
            <img src={meal.image} alt="Recipe" className="recipe-image" />
            <div className="recipe-text">
              <div className="title">{meal.ingredients}</div>
              <p className="description">{meal.description}</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
