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
      with open(".nft-generator-py-recruit/metadata/" + str(item["tokenId"]) + ".json", "r") as infile:
        original_json = json.loads(infile.read())
        original_json["image"] = original_json["image"].replace(config["baseURI"]+"/", cid+"/")
        with open("./metadata/" + str(item["tokenId"]) + ".json", "w") as outfile:
          json.dump(original_json, outfile, indent=4)

generate_unique_images(4000, {
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
        "Fake Suit Navy",
        "Hoodie Black", "Hoodie Blue", "Hoodie Green", "Hoodie Light Green", "Hoodie Navy", "Hoodie Orange", "Hoodie Purple", "Hoodie Red", "Hoodie White",
      ],
      "trait_path": "./trait-layers/clothing",
      "filename":[
        "Fake_Suit_Navy",
        "Hoodie_Black", "Hoodie_Blue", "Hoodie_Green", "Hoodie_Light_Green", "Hoodie_Navy", "Hoodie_Orange", "Hoodie_Purple", "Hoodie_Red", "Hoodie_White",
      ],
      "weights":[
        10,
        10, 10, 10, 10, 10, 10, 10, 10, 10,
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
      "name":"Recruit Mask",
      "values":[
        "Basic Black", "Basic Blue", "Basic Green", "Basic Navy", "Basic Orange", "Basic Purple", "Basic Red", "Basic Yellow", 
        "Daisy Blue", "Daisy Green", "Daisy Navy", "Daisy Orange", "Daisy Purple", "Daisy Red", "Daisy Yellow", 
      ],
      "trait_path": "./trait-layers/mask",
      "filename":[
        "Basic_Black", "Basic_Blue", "Basic_Green", "Basic_Navy", "Basic_Orange", "Basic_Purple", "Basic_Red", "Basic_Yellow", 
        "Daisy_Blue", "Daisy_Green", "Daisy_Navy", "Daisy_Orange", "Daisy_Purple", "Daisy_Red", "Daisy_Yellow", 
      ],
      "weights":[
        10, 10, 10, 10, 10, 10, 10, 10,
        2.85, 2.85, 2.90, 2.85, 2.85, 2.85, 2.85
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
  "baseURI": "https://space-bank.s3.us-west-1.amazonaws.com/recruit",
  "name": "Space Bank Recruit #",
  "description": "Space Bank Recruit NFT Collection"
})

#Additional layer objects can be added following the above formats. They will automatically be composed along with the rest of the layers as long as they are the same size as eachother.
#Objects are layered starting from 0 and increasing, meaning the front layer will be the last object. (Branding)
