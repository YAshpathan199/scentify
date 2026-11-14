import bpy
import math
import random

# ─── Clear scene ───
bpy.ops.object.select_all(action='SELECT')
bpy.ops.object.delete(use_global=False)
for c in bpy.data.collections:
    if c.name != 'Collection':
        bpy.data.collections.remove(c)
for mat in bpy.data.materials:
    bpy.data.materials.remove(mat)
for world in bpy.data.worlds:
    bpy.data.worlds.remove(world)

# ─── World / HDRI-style background ───
world = bpy.data.worlds.new("ScentifyWorld")
bpy.context.scene.world = world
world.use_nodes = True
nodes = world.node_tree.nodes
links = world.node_tree.links
nodes.clear()

bg = nodes.new('ShaderNodeBackground')
bg.inputs['Color'].default_value = (0.02, 0.01, 0.03, 1)
bg.inputs['Strength'].default_value = 0.3

output = nodes.new('ShaderNodeOutputWorld')
links.new(bg.outputs['Background'], output.inputs['Surface'])


# ─── Helper: glass material ───
def make_glass_material(name, color, roughness=0.05, ior=1.52):
    mat = bpy.data.materials.new(name)
    mat.use_nodes = True
    nodes = mat.node_tree.nodes
    links = mat.node_tree.links
    nodes.clear()

    glass = nodes.new('ShaderNodeBsdfGlass')
    glass.inputs['Color'].default_value = (*color, 1)
    glass.inputs['Roughness'].default_value = roughness
    glass.inputs['IOR'].default_value = ior

    output = nodes.new('ShaderNodeOutputMaterial')
    links.new(glass.outputs['BSDF'], output.inputs['Surface'])
    mat.blend_method = 'BLEND' if hasattr(mat, 'blend_method') else None
    return mat


# ─── Helper: metallic material ───
def make_metal_material(name, color, roughness=0.15):
    mat = bpy.data.materials.new(name)
    mat.use_nodes = True
    nodes = mat.node_tree.nodes
    links = mat.node_tree.links
    nodes.clear()

    principled = nodes.new('ShaderNodeBsdfPrincipled')
    principled.inputs['Base Color'].default_value = (*color, 1)
    principled.inputs['Metallic'].default_value = 1.0
    principled.inputs['Roughness'].default_value = roughness

    output = nodes.new('ShaderNodeOutputMaterial')
    links.new(principled.outputs['BSDF'], output.inputs['Surface'])
    return mat


# ─── Helper: emission material ───
def make_emission_material(name, color, strength=5.0):
    mat = bpy.data.materials.new(name)
    mat.use_nodes = True
    nodes = mat.node_tree.nodes
    links = mat.node_tree.links
    nodes.clear()

    emit = nodes.new('ShaderNodeEmission')
    emit.inputs['Color'].default_value = (*color, 1)
    emit.inputs['Strength'].default_value = strength

    output = nodes.new('ShaderNodeOutputMaterial')
    links.new(emit.outputs['Emission'], output.inputs['Surface'])
    return mat


# ─── Materials ───
bottle_glass = make_glass_material("BottleGlass", (0.85, 0.65, 0.95), roughness=0.02, ior=1.52)
liquid_mat = make_glass_material("PerfumeLiquid", (0.95, 0.55, 0.75), roughness=0.0, ior=1.36)
cap_gold = make_metal_material("GoldCap", (0.95, 0.75, 0.3), roughness=0.1)
platform_mat = make_metal_material("Platform", (0.15, 0.08, 0.2), roughness=0.4)
nozzle_mat = make_metal_material("Nozzle", (0.85, 0.85, 0.88), roughness=0.05)
particle_glow = make_emission_material("ParticleGlow", (0.9, 0.5, 0.9), strength=8.0)
particle_gold = make_emission_material("ParticleGold", (1.0, 0.85, 0.4), strength=6.0)
text_emit = make_emission_material("TextEmit", (0.95, 0.6, 0.85), strength=3.0)


# ─── Perfume bottle body (lathe profile via curve) ───
bpy.ops.mesh.primitive_cylinder_add(
    radius=0.6, depth=2.0, vertices=64, location=(0, 0, 1.0)
)
bottle = bpy.context.active_object
bottle.name = "PerfumeBottle"

bpy.ops.object.modifier_add(type='SUBSURF')
bottle.modifiers["Subdivision"].levels = 2
bottle.modifiers["Subdivision"].render_levels = 3

bpy.ops.object.shade_smooth()
bottle.data.materials.append(bottle_glass)

# Sculpt bottle shape with lattice
bpy.ops.object.add(type='LATTICE', location=(0, 0, 1.0))
lattice = bpy.context.active_object
lattice.name = "BottleLattice"
lattice.data.points_u = 3
lattice.data.points_v = 3
lattice.data.points_w = 5
lattice.scale = (1.4, 1.4, 2.4)

# Shape the bottle via lattice points
for p in lattice.data.points:
    z_norm = (p.co_deform.z + 0.5)
    if z_norm < 0.15:
        p.co_deform.x *= 0.85
        p.co_deform.y *= 0.85
    elif z_norm > 0.75:
        neck_factor = 1.0 - (z_norm - 0.75) * 2.5
        neck_factor = max(neck_factor, 0.35)
        p.co_deform.x *= neck_factor
        p.co_deform.y *= neck_factor

bottle.select_set(True)
bpy.context.view_layer.objects.active = bottle
mod = bottle.modifiers.new("Lattice", 'LATTICE')
mod.object = lattice


# ─── Liquid inside ───
bpy.ops.mesh.primitive_cylinder_add(
    radius=0.55, depth=1.2, vertices=64, location=(0, 0, 0.7)
)
liquid = bpy.context.active_object
liquid.name = "PerfumeLiquid"
bpy.ops.object.shade_smooth()
liquid.data.materials.append(liquid_mat)

mod = liquid.modifiers.new("Lattice", 'LATTICE')
mod.object = lattice


# ─── Bottle neck ───
bpy.ops.mesh.primitive_cylinder_add(
    radius=0.22, depth=0.4, vertices=48, location=(0, 0, 2.1)
)
neck = bpy.context.active_object
neck.name = "BottleNeck"
bpy.ops.object.shade_smooth()
neck.data.materials.append(bottle_glass)


# ─── Gold cap ───
bpy.ops.mesh.primitive_cylinder_add(
    radius=0.35, depth=0.5, vertices=48, location=(0, 0, 2.6)
)
cap = bpy.context.active_object
cap.name = "GoldCap"

bpy.ops.object.modifier_add(type='BEVEL')
cap.modifiers["Bevel"].width = 0.03
cap.modifiers["Bevel"].segments = 3

bpy.ops.object.shade_smooth()
cap.data.materials.append(cap_gold)


# ─── Spray nozzle ───
bpy.ops.mesh.primitive_cylinder_add(
    radius=0.08, depth=0.15, vertices=32, location=(0, 0, 2.38)
)
nozzle = bpy.context.active_object
nozzle.name = "Nozzle"
bpy.ops.object.shade_smooth()
nozzle.data.materials.append(nozzle_mat)


# ─── Display platform ───
bpy.ops.mesh.primitive_cylinder_add(
    radius=1.8, depth=0.15, vertices=64, location=(0, 0, -0.075)
)
platform = bpy.context.active_object
platform.name = "DisplayPlatform"

bpy.ops.object.modifier_add(type='BEVEL')
platform.modifiers["Bevel"].width = 0.02
platform.modifiers["Bevel"].segments = 2

bpy.ops.object.shade_smooth()
platform.data.materials.append(platform_mat)


# ─── Floating particles (scent molecules) ───
random.seed(42)
for i in range(60):
    angle = random.uniform(0, 2 * math.pi)
    radius = random.uniform(0.3, 2.5)
    height = random.uniform(0.5, 4.0)
    size = random.uniform(0.02, 0.06)

    bpy.ops.mesh.primitive_uv_sphere_add(
        radius=size, segments=12, ring_count=8,
        location=(math.cos(angle) * radius, math.sin(angle) * radius, height)
    )
    particle = bpy.context.active_object
    particle.name = f"ScentParticle_{i:03d}"
    bpy.ops.object.shade_smooth()

    if random.random() > 0.5:
        particle.data.materials.append(particle_glow)
    else:
        particle.data.materials.append(particle_gold)


# ─── "SCENTIFY" text ───
bpy.ops.object.text_add(location=(0, -1.2, 0.1), rotation=(math.pi / 2, 0, 0))
text_obj = bpy.context.active_object
text_obj.data.body = "SCENTIFY"
text_obj.data.size = 0.35
text_obj.data.extrude = 0.02
text_obj.data.align_x = 'CENTER'
text_obj.data.align_y = 'CENTER'
text_obj.name = "ScentifyText"

bpy.ops.object.convert(target='MESH')
bpy.ops.object.shade_smooth()
text_obj.data.materials.append(text_emit)


# ─── Lighting ───

# Key light (warm, from upper right)
bpy.ops.object.light_add(type='AREA', location=(3, -2, 5))
key_light = bpy.context.active_object
key_light.name = "KeyLight"
key_light.data.energy = 300
key_light.data.color = (1.0, 0.92, 0.85)
key_light.data.size = 3
key_light.rotation_euler = (math.radians(45), 0, math.radians(30))

# Fill light (cool purple, from left)
bpy.ops.object.light_add(type='AREA', location=(-3, -1, 3))
fill_light = bpy.context.active_object
fill_light.name = "FillLight"
fill_light.data.energy = 150
fill_light.data.color = (0.8, 0.6, 1.0)
fill_light.data.size = 4
fill_light.rotation_euler = (math.radians(50), 0, math.radians(-40))

# Rim light (behind, for edge glow)
bpy.ops.object.light_add(type='AREA', location=(0, 3, 2.5))
rim_light = bpy.context.active_object
rim_light.name = "RimLight"
rim_light.data.energy = 200
rim_light.data.color = (0.95, 0.7, 0.95)
rim_light.data.size = 2
rim_light.rotation_euler = (math.radians(-30), 0, math.radians(180))

# Accent spot from below
bpy.ops.object.light_add(type='SPOT', location=(0, 0, -0.5))
spot = bpy.context.active_object
spot.name = "UnderGlow"
spot.data.energy = 100
spot.data.color = (0.9, 0.5, 1.0)
spot.data.spot_size = math.radians(60)
spot.rotation_euler = (0, 0, 0)


# ─── Camera ───
bpy.ops.object.camera_add(location=(4.5, -4.5, 3.5))
camera = bpy.context.active_object
camera.name = "ScentifyCamera"

constraint = camera.constraints.new(type='TRACK_TO')
constraint.target = bottle
constraint.track_axis = 'TRACK_NEGATIVE_Z'
constraint.up_axis = 'UP_Y'

camera.data.lens = 50
camera.data.dof.use_dof = True
camera.data.dof.focus_object = bottle
camera.data.dof.aperture_fvalue = 2.8
bpy.context.scene.camera = camera


# ─── Render settings ───
scene = bpy.context.scene
scene.render.engine = 'CYCLES'
scene.cycles.samples = 256
scene.cycles.use_denoising = True
scene.render.resolution_x = 1920
scene.render.resolution_y = 1080
scene.render.film_transparent = True

if bpy.context.preferences.addons.get('cycles'):
    cycles_prefs = bpy.context.preferences.addons['cycles'].preferences
    if hasattr(cycles_prefs, 'compute_device_type'):
        cycles_prefs.compute_device_type = 'CUDA'
        cycles_prefs.get_devices()
        for device in cycles_prefs.devices:
            device.use = True
        scene.cycles.device = 'GPU'

# Set output path
scene.render.filepath = "//scentify_render.png"
scene.render.image_settings.file_format = 'PNG'

print("\n" + "=" * 50)
print("  SCENTIFY 3D SCENE CREATED!")
print("  Press F12 to render, or just enjoy the viewport")
print("=" * 50 + "\n")
