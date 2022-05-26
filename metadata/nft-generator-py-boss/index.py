from IPython.display import display 
from PIL import Image
import random
import json
import os

os.system("cls" if os.name=="nt" else "clear")

def create_new_image(all_images, config):
    new_image = {}
    for layer in config["layers"]:
      new_image[layer["name"]] = random.choices(layer["values"], layer["weights"])[0]
    
    for incomp in config["incompatibilities"]:
      for attr in new_image:
        if new_image[incomp["layer"]] == incomp["value"] and new_image[attr] in incomp["incompatible_with"]:
          return create_new_image(all_images, config)

    if new_image in all_images:
      return create_new_image(all_images, config)
    else:
      return new_image

def generate_unique_images(amount, config):
  print("Generating {} unique NFTs...".format(amount))
  pad_amount = len(str(amount))
  trait_files = {
  }
  for trait in config["layers"]:
    trait_files[trait["name"]] = {}
    for x, key in enumerate(trait["values"]):
      trait_files[trait["name"]][key] = trait["filename"][x]
  
  all_images = []
  for i in range(amount): 
    new_trait_image = create_new_image(all_images, config)
    all_images.append(new_trait_image)

  i = 1
  for item in all_images:
      item["tokenId"] = i
      i += 1

  for i, token in enumerate(all_images):
    attributes = []
    for key in token:
      if key != "tokenId":
        attributes.append({"trait_type": key, "value": token[key]})
    token_metadata = {
        "image": config["baseURI"] + "/images/" + str(token["tokenId"]) + ".png",
        "tokenId": token["tokenId"],
        "name":  config["name"] + str(token["tokenId"]).zfill(pad_amount),
        "description": config["description"],
        "attributes": attributes
    }
    with open("./metadata/" + str(token["tokenId"]) + ".json", "w") as outfile:
        json.dump(token_metadata, outfile, indent=4)

  with open("./metadata/all-objects.json", "w") as outfile:
    json.dump(all_images, outfile, indent=4)
  
  for item in all_images:
    layers = []
    for index, attr in enumerate(item):
      if attr != "tokenId":
        layers.append([])
        layers[index] = Image.open(f'{config["layers"][index]["trait_path"]}/{trait_files[attr][item[attr]]}.png').convert('RGBA')


    if len(layers) == 1:
      rgb_im = layers[0].convert("RGBA")
      file_name = str(item["tokenId"]) + ".png"
      rgb_im.save("./images/" + file_name)
    elif len(layers) == 2:
      main_composite = Image.alpha_composite(layers[0], layers[1])
      rgb_im = main_composite.convert("RGBA")
      file_name = str(item["tokenId"]) + ".png"
      rgb_im.save("./images/" + file_name)
    elif len(layers) >= 3:
      main_composite = Image.alpha_composite(layers[0], layers[1])
      layers.pop(0)
      layers.pop(0)
      for index, remaining in enumerate(layers):
        main_composite = Image.alpha_composite(main_composite, remaining)
      rgb_im = main_composite.convert("RGBA")
      file_name = str(item["tokenId"]) + ".png"
      rgb_im.save("./images/" + file_name)
  
  # v1.0.2 addition
  print("\nUnique NFT's generated. After uploading images to IPFS, please paste the CID below.\nYou may hit ENTER or CTRL+C to quit.")
  cid = input("IPFS Image CID (): ")
  if len(cid) > 0:
    if not cid.startswith("ipfs://"):
      cid = "ipfs://{}".format(cid)
    if cid.endswith("/"):
      cid = cid[:-1]
    for i, item in enumerate(all_images):
      with open("./metadata/" + str(item["tokenId"]) + ".json", "r") as infile:
        original_json = json.loads(infile.read())
        original_json["image"] = original_json["image"].replace(config["baseURI"]+"/", cid+"/")
        with open("./metadata/" + str(item["tokenId"]) + ".json", "w") as outfile:
          json.dump(original_json, outfile, indent=4)

generate_unique_images(1000, {
  "layers": [
    {
      "name": "Background",
      "values": [
        "Black", "Blue", "Brown", "Green", "Navy", "Pink", "Purple", "White"
      ],
      "trait_path": "./trait-layers/Background",
      "filename":[
        "Black", "Blue", "Brown", "Green", "Navy", "Pink", "Purple", "White"
      ],
      "weights": [12.5, 12.5, 12.5, 12.5, 12.5, 12.5, 12.5, 12.5]
    },

    {
      "name": "Skin",
      "values":[
        "Black Skin", "Brown Skin", "Pale White Skin", "White Skin", "Yellow Skin"
      ],
      "trait_path": "./trait-layers/skin",
      "filename":[
        "Black_Skin", "Brown_Skin", "Pale_White_Skin", "White_Skin", "Yellow_Skin"
      ],
      "weights":[
        20, 20, 20, 20, 20
      ]
    },

    {
      "name": "Outline",
      "values":[
        "Base"
      ],
      "trait_path": "./trait-layers/outline",
      "filename":[
        "Base"
      ],
      "weights":[
        100
      ]
    },

    {
      "name": "Gun",
      "values":[
        "None",
        "AK 47", "Shotgun", "Sniper"
      ],
      "trait_path": "./trait-layers/gun",
      "filename":[
        "None",
        "AK47", "Shotgun", "Sniper"
      ],
      "weights":[
        85,
        5, 5, 5
      ]
    },

    {
      "name":"Clothing",
      "values":[
        "Purple Joker Suit Open", "Red Joker Suit Open",
        "Purple Joker Suit", "Red Joker Suit",
        "Suit Blue Open", "Suit Brown Open", "Suit Grass Open", "Suit Green Open", "Suit Navy Open", "Suit Purple Open", "Suit Wine Open",
        "Suit Blue", "Suit Brown", "Suit Grass", "Suit Green", "Suit Navy", "Suit Purple", "Suit Wine"
      ],
      "trait_path": "./trait-layers/clothing",
      "filename":[
        "Purple_Joker_Suit_Open", "Red_Joker_Suit_Open",
        "Purple_Joker_Suit", "Red_Joker_Suit",
        "Suit_Blue_Open", "Suit_Brown_Open", "Suit_Grass_Open", "Suit_Green_Open", "Suit_Navy_Open", "Suit_Purple_Open", "Suit_Wine_Open",
        "Suit_Blue", "Suit_Brown", "Suit_Grass", "Suit_Green", "Suit_Navy", "Suit_Purple", "Suit_Wine"
      ],
      "weights":[
        5.55, 5.55,
        5.55, 5.55,
        5.55, 5.55, 5.55, 5.55, 5.55, 5.55, 5.55,
        5.55, 5.55, 5.55, 5.56, 5.55, 5.55, 5.55
      ]
    },

    {
      "name": "Necklace",
      "values":[
        "None",
        "Gold Chain", "Silver Chain"
      ],
      "trait_path": "./trait-layers/necklace",
      "filename":[
        "No_Chain",
        "Gold_Chain", "Silver_Chain"
      ],
      "weights":[
        90,
        5, 5
      ]
    },

    {
      "name": "Eye",
      "values":[
        "Dark Eyes", "Light Eyes", "Red Eyes"
      ],
      "trait_path": "./trait-layers/eye",
      "filename":[
        "Dark_Eyes", "Light_Eyes", "Red_Eyes",
      ],
      "weights":[
        33, 34, 33
      ]
    },

    {
      "name": "Eyebrow",
      "values":[
        "Black Eyebrows", "Blue Eyebrows", "Dark_Grey Eyebrows", "Green Eyebrows", "Light_Grey Eyebrows", "Navy Eyebrows", "Orange Eyebrows", "Pink Eyebrows", "Red Eyebrows", "Yellow Eyebrows"
      ],
      "trait_path": "./trait-layers/eyebrow",
      "filename":[
        "Black_Eyebrows", "Blue_Eyebrows", "Dark_Grey_Eyebrows", "Green_Eyebrows", "Light_Grey_Eyebrows", "Navy_Eyebrows", "Orange_Eyebrows", "Pink_Eyebrows", "Red_Eyebrows", "Yellow_Eyebrows"
      ],
      "weights":[
        10, 10, 10, 10, 10, 10, 10, 10, 10, 10
      ]
    },

    {
      "name": "Hair",
      "values":[
        "Blue Hair", "Dark Grey Hair", "Green Hair", "Navy Hair", "Orange Hair", "Pink Hair", "Red Hair", "White Hair", "Yellow Hair"
      ],
      "trait_path": "./trait-layers/hair",
      "filename":[
        "Blue_Hair", "Dark_Grey_Hair", "Green_Hair", "Navy_Hair", "Orange_Hair", "Pink_Hair", "Red_Hair", "White_Hair", "Yellow_Hair"
      ],
      "weights":[
        11, 11, 11, 12, 11, 11, 11, 11, 11
      ]
    },

    {
      "name":"Boss Mask",
      "values":[
        "Chain Mask Light Green", "Chain Mask Navy", "Chain Mask Orange", "Chain Mask Purple", "Chain Mask Red",
        "Gumba Mask Blue", "Gumba Mask Green", "Gumba Mask Orange", "Gumba Mask Pink", "Gumba Mask Purple",
        "Oni God Black", "Oni God Blue", "Oni God Green", "Oni God Navy", "Oni God Red", "Oni God White", "Oni God Yellow",
        "Oni Mask Blue", "Oni Mask Green", "Oni Mask Navy", "Oni Mask Pink", "Oni Mask Red",
        "USA Mask Green", "USA Mask Navy", "USA Mask Orange", "USA Mask Red",
        "Wolf Mask Blue", "Wolf Mask Green", "Wolf Mask Navy", "Wolf Mask Red"
      ],
      "trait_path": "./trait-layers/mask",
      "filename":[
        "Chain_Mask_Light_Green", "Chain_Mask_Navy", "Chain_Mask_Orange", "Chain_Mask_Purple", "Chain_Mask_Red",
        "Gumba_Mask_Blue", "Gumba_Mask_Green", "Gumba_Mask_Orange", "Gumba_Mask_Pink", "Gumba_Mask_Purple",
        "Oni_God_Black", "Oni_God_Black", "Oni_God_Black", "Oni_God_Black", "Oni_God_Black", "Oni_God_Black", "Oni_God_Black",
        "Oni_Mask_Blue", "Oni_Mask_Green", "Oni_Mask_Navy", "Oni_Mask_Pink", "Oni_Mask_Red",
        "USA_Mask_Green", "USA_Mask_Navy", "USA_Mask_Orange", "USA_Mask_Red",
        "Wolf_Mask_Blue", "Wolf_Mask_Green", "Wolf_Mask_Navy", "Wolf_Mask_Red"
      ],
      "weights":[
        3.32, 3.33, 3.33, 3.33, 3.33,
        3.33, 3.33, 3.33, 3.33, 3.33,
        2.38, 2.38, 2.38, 2.38, 2.38, 2.38, 2.38,
        3.33, 3.33, 3.33, 3.33, 3.33,
        4.175, 4.175, 4.175, 4.175, 
        4.175, 4.175, 4.175, 4.175
      ]
    },

    {
      "name": "Blood Stain",
      "values":["None", "Blood"],
      "trait_path": "./trait-layers/blood",
      "filename" : ["Blank", "Blood"],
      "weights": [90, 10]
    },

    {
      "name": "Effect",
      "values":[
        "None",
        "Blank_FX", "Blue_FX", "Brown_FX", "Dark_Blue_FX", "Green_FX", "Lime_FX", "Purple_FX", "Red_FX"
      ],
      "trait_path": "./trait-layers/effect",
      "filename":[
        "None",
        "Blank_FX", "Blue_FX", "Brown_FX", "Dark_Blue_FX", "Green_FX", "Lime_FX", "Purple_FX", "Red_FX"
      ],
      "weights":[
        91,
        1, 1, 1, 1, 1, 1, 1, 1
      ]
    },
  ],
  "incompatibilities": [
    {
      "layer": "Background",
      "value": "Blue",
      "incompatible_with": ["Python Logo 2"]
    },  #  @dev : Blue backgrounds will never have the attribute "Python Logo 2".
  ],
  "baseURI": ".",
  "name": "Space Bank Mob Boss #",
  "description": "Space Bank Mob Boss NFT Collection"
})

#Additional layer objects can be added following the above formats. They will automatically be composed along with the rest of the layers as long as they are the same size as eachother.
#Objects are layered starting from 0 and increasing, meaning the front layer will be the last object. (Branding)
