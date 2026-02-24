import express, { Request, Response } from "express";

// ==== Type Definitions, feel free to add or modify ==========================
interface cookbookEntry {
  name: string;
  type: string;
}

interface requiredItem {
  name: string;
  quantity: number;
}

interface recipe extends cookbookEntry {
  requiredItems: requiredItem[];
}

interface ingredient extends cookbookEntry {
  cookTime: number;
}

type EmptyObject = Record<string, never>;

interface ErrorObject {
  error: string;
  message: string;
}

// =============================================================================
// ==== HTTP Endpoint Stubs ====================================================
// =============================================================================
const app = express();
app.use(express.json());

// Store your recipes here!
const cookbook: any = null;

// Task 1 helper (don't touch)
app.post("/parse", (req:Request, res:Response) => {
  const { input } = req.body;

  const parsed_string = parse_handwriting(input)
  if (parsed_string == null) {
    res.status(400).send("this string is cooked");
    return;
  } 
  res.json({ msg: parsed_string });
  return;
  
});

// [TASK 1] ====================================================================
// Takes in a recipeName and returns it in a form that 
const parse_handwriting = (recipeName: string): string | null => {
  // Replacing hyphens and underscore, nonalphabetic  characters, and multiple whitespaces
  recipeName = recipeName.replace(/[-_]+/g, ' ').replace(/[^a-zA-Z\s]+/g, '');
  recipeName = recipeName.replace(/\s+/g, ' ').trim();
  if (recipeName.length === 0) return null;

  // Trim whitespace and capitalise the first letter
  const words = recipeName.split(' ');
  const parsedWriting = words.map(word => {
    word = word.toLowerCase().trim();
    return word.charAt(0).toUpperCase() + word.slice(1);
  })

  return parsedWriting.join(' ');
}

// [TASK 2] ====================================================================
// Endpoint that adds a CookbookEntry to your magical cookbook
app.post("/entry", (req:Request, res:Response) => {
  // TODO: implement me
  const input = req.body;
  const addEntryReturn = add_cookbook_entry(input);
  if ('error' in addEntryReturn) {
    res.status(400).json(addEntryReturn);
    return;
  } 

  res.status(200).json(addEntryReturn);
  return;
});

const CookBookEntryStore: {list: (recipe | ingredient)[]} = {
  list: []
}

function getData() {
  return CookBookEntryStore;
}

function add_cookbook_entry(entry: recipe | ingredient): EmptyObject | ErrorObject {
  if (entry.type !== 'recipe' && entry.type !== 'ingredient') {
    return { error: 'INVALID_TYPE', message: 'Invalid type is given'};
  }

  const data = getData().list;
  if (data.some(item => item.name === entry.name)) {
    return { error: 'INVALID_NAME', message: 'there is an entry with the same name' };
  }

  // Check if it is an ingredient, so shcke if the cook time is 0 or more
  if (entry.type === 'ingredient') {
    const ingEntry = entry as ingredient;
    if (ingEntry.cookTime < 0) {
      return { error: 'INVALID_COOKTIME', message: 'Invalid cooktime is given'};
    }
  } else {
    // Else its a recipe, so check if there are duplicate ingredients
    const rcpEntry = entry as recipe;
    const ingredientNames = rcpEntry.requiredItems.map(item => item.name);
    const uniqueNames = new Set(ingredientNames);
    if (uniqueNames.size !== ingredientNames.length) {
      return { error: 'INVALID_INGREDIENT', message: 'there are duplicate ingredient names'};
    }
  }

  data.push(entry);
  return {};
}

// [TASK 3] ====================================================================
// Endpoint that returns a summary of a recipe that corresponds to a query name
app.get("/summary", (req:Request, res:Request) => {
  // TODO: implement me
  res.status(500).send("not yet implemented!")

});

// =============================================================================
// ==== DO NOT TOUCH ===========================================================
// =============================================================================
const port = 8080;
app.listen(port, () => {
  console.log(`Running on: http://127.0.0.1:8080`);
});
